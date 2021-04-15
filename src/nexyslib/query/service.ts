/**
 * note: sometimes functions are formatted with `myFunc = async () => {} ` and sometimes `async myFunc() { return ...}`
 * the former is not recognized by jest
 */

import HTTP from "@nexys/http";

import Service from "../service";
import * as QueryUtil from "./utils";
import * as QConstraint from "./constraint";
import * as T from "./types";
import { Id, Uuid } from "@nexys/utils/dist/types";

import {
  Params,
  Filters,
  Query,
  QueryResponse,
  Mutate,
  MutateResponse,
  MutateResponseInsert,
  Projection,
  References,
  MutateResponseUpdate,
  MutateResponseDelete,
} from "./types";

abstract class QueryService extends Service {
  // is used as a placeholder, needs to be defined in child class
  abstract request(uri: string, payload: any): Promise<any>;

  async data(query: Query): Promise<QueryResponse> {
    // TODO: implement references inside projection
    return await this.request("/data", query);
  }

  async mutate(query: Mutate): Promise<MutateResponse> {
    return await this.request("/mutate", query);
  }

  insert = async <A = any>(
    entity: string,
    data: Omit<A, "uuid" | "id">
  ): Promise<{ uuid: string } | { id: number }> => {
    const query = QueryUtil.insert(entity, data);

    const response: MutateResponse = await this.mutate(query);
    if (response && response[entity]) {
      const insertResponse: MutateResponseInsert = <MutateResponseInsert>(
        response[entity].insert
      );
      if (insertResponse.success) {
        const { uuid, id } = insertResponse;
        if (uuid) {
          return { uuid };
        }
        if (id) {
          return { id };
        }

        throw new HTTP.Error(response, 400);
      }

      throw new HTTP.Error(response.status);
    }

    throw new HTTP.Error(response, 500);
  };

  insertId = <A = any>(
    entity: string,
    data: Omit<A, "id">
  ): Promise<{ id: number }> =>
    this.insert<A>(entity, data as Omit<A, "id" | "uuid">) as Promise<{
      id: Id;
    }>;

  async insertUuid<A = any>(
    entity: string,
    data: Omit<A, "uuid">
  ): Promise<{ uuid: string }> {
    return this.insert<A>(entity, data as Omit<A, "id" | "uuid">) as Promise<{
      uuid: Uuid;
    }>;
  }

  /**
   * insert multiple - wrapper around `mutate`
   * @param rows: already formatted rows (array)
   **/
  async insertMultiple<A = any>(
    entity: string,
    data: A[] = []
  ): Promise<MutateResponseInsert[]> {
    if (data.length === 0) {
      throw new HTTP.Error(`No rows for ${entity} provided`, 400);
    }

    const query = QueryUtil.insert(entity, data);
    const r = await this.mutate(query);

    if (r[entity].insert && Array.isArray(r[entity].insert)) {
      const t: MutateResponseInsert[] = r[entity]
        .insert as MutateResponseInsert[];
      return t;
    }
    console.log(JSON.stringify(data, null, 2));
    throw new HTTP.Error(
      `Something went wrong while inserting rows for ${entity} provided, see log for more information`,
      400
    );
  }

  async update<A = any>(
    entity: string,
    filters: number | string | Filters,
    data: Partial<A>
  ): Promise<MutateResponseUpdate> {
    const query: Mutate = QueryUtil.update(entity, filters, data);
    const r = await this.mutate(query);
    if (!(entity in r)) {
      throw Error("something went wrong while trying to update");
    }

    const re: { update?: MutateResponseUpdate } = r[entity];

    if (!re.update) {
      throw Error(
        "CRUD could not update, errors from https://github.com/Nexysweb/lib/blob/master/src/query/index.ts#L103"
      );
    }

    return re.update;
  }

  /**
   * this implementation of update multiple is a wrapper on top of `update` so that it can update more than one record with different filters
   * @param entity
   * @param paramsMultiple
   */
  async updateMultiple<A = any>(
    entity: string,
    paramsMultiple: { filters: number | string | Filters; data: Partial<A> }[]
  ): Promise<MutateResponseUpdate[]> {
    const r = paramsMultiple.map(
      async ({ filters, data }) => await this.update(entity, filters, data)
    );
    return Promise.all(r);
  }

  async list<A = any>(entity: string, params: Params = {}): Promise<A[]> {
    // TODO entity: only first letter uppercase?
    const data = await this.data({ [entity]: params });
    return QueryUtil.getList(data, entity);
  }

  async find<A = any>(
    entity: string,
    params: Params = {},
    optional: boolean = false
  ): Promise<A> {
    const data = await this.list(entity, params);
    return QueryUtil.getFirst(data, entity, optional);
  }

  async count(entity: string, filters: Filters = {}) {
    const uri = `/${entity.toLowerCase()}/count`;
    const payload = { params: { filters } };
    return await this.request(uri, payload);
  }

  async detail<A = any>(
    entity: string,
    id: string | number,
    projection?: Projection,
    references?: References
  ): Promise<A> {
    const filters = QueryUtil.paramsFromFilters(id);
    return await this.find(entity, { filters, projection, references });
  }

  /**
   * deletes record(s)
   * @param entity entity of interest
   * @param filters : filters
   */
  async delete(
    entity: string,
    filters: number | string | Filters
  ): Promise<MutateResponseDelete> {
    const query = QueryUtil.deleteById(entity, filters);

    const r = await this.mutate(query);

    if (!(entity in r)) {
      throw Error("something went wrong while trying to delete");
    }

    const re: { delete?: MutateResponseDelete } = r[entity];

    if (!re.delete) {
      throw Error(
        "CRUD could not delete, errors from see https://github.com/Nexysweb/lib/blob/master/src/query/index.ts#L161 "
      );
    }

    return re.delete;
  }

  dataWithConstraint = async (
    query: T.Query,
    constraints: T.QueryConstraint
  ): Promise<T.QueryResponse> => {
    QueryUtil.constructQueryPermission(
      query,
      constraints.filterConstraintsMap,
      constraints.projectionConstraintsMap
    );
    return this.data(query);
  };

  mutateWithConstraint = async (
    query: T.Mutate,
    constraints: T.MutateConstraint
  ): Promise<{ status: number; body: T.MutateResponse | string }> => {
    query = QueryUtil.constructMutatePermission(
      query,
      constraints.filterConstraintsMap,
      constraints.dataConstraintsMap,
      constraints.append
    );

    try {
      const r = await this.mutate(query);

      return QConstraint.mutatePostProcessing(r);
    } catch (err) {
      return {
        status: 500,
        body: "internal server error when querying mutate",
      };
    }
  };
}

export default QueryService;
