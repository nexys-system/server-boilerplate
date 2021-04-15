/**
 * manages positions in a list
 * required attributes are
 * - id/uuid (currently only works for uuid)
 * - position
 */
import * as Query from "./query";
import { updateParams } from "./utils";
import { getDetail } from "../utils";

import AbstractQueryService from "../index";
import * as Type from "../types";

// todo have flexible between `id` and `uuid`;
const idLabel = "uuid";

// have all in a class
// e.g.
/*export class Position {
  constructor(entity, QueryService, idLabel = 'uuid') {
    this.entity = entity;
    this.QueryService = QueryService;
    this.idLabel = idLabel;
  }
}*/
// or extend QueryService?

export const move = async (
  id: number | string,
  n: number,
  entity: string,
  QueryService: AbstractQueryService
) => {
  const item = await QueryService.detail(entity, id);
  const { position } = item;

  return await updateAffectedRows(
    { [idLabel]: id, position },
    n,
    entity,
    QueryService
  );
};

export const updateAffectedRows = async (
  item: any,
  n: number,
  entity: string,
  QueryService: AbstractQueryService
) => {
  const { position } = item;
  const filters = Query.listFiltered(position, n);
  const filteredList = await QueryService.list(entity, {
    projection: { [idLabel]: true, position: true },
    filters,
  });

  const u = updateParams(item, n, filteredList, idLabel);

  const preMutateQuery = await u.map(async (x) => {
    const [data, filters] = x;

    const q: Type.Mutate = {
      [entity]: {
        update: { filters, data },
      },
    };

    return await QueryService.mutate(q);
  });

  return preMutateQuery;
};

export const up = (
  id: number | string,
  entity: string,
  QueryService: AbstractQueryService
) => move(id, 1, entity, QueryService);

export const down = (
  id: number | string,
  entity: string,
  QueryService: AbstractQueryService
) => move(id, -1, entity, QueryService);

/**
 * get highest item in the list
 * @param {*} entity
 * @param {*} QueryService
 */
const getHighest = async (
  entity: string,
  QueryService: AbstractQueryService
): Promise<any> => {
  const q = await QueryService.data(Query.highestPosition(entity));
  const d = getDetail(q, entity, true);

  return d;
};

/**
 * get highest position in the list
 * @param {*} entity
 * @param {*} QueryService
 */
const getHighestIdx = async (
  entity: string,
  QueryService: AbstractQueryService
): Promise<number> => {
  const d = await getHighest(entity, QueryService);
  return d === null ? 0 : d.position;
};

export const insert = async (
  item: any,
  entity: string,
  QueryService: AbstractQueryService
) => {
  const highestPositionIdx = await getHighestIdx(entity, QueryService);
  const position = highestPositionIdx + 1;

  item.position = position;

  return await QueryService.insert(entity, item);
};

/**
 * delete item by id and reposition the other ones
 * @param  {[type]} position position of deleted item
 * @return {[type]}          [description]
 */
export const deleteById = async (
  id: number | string,
  entity: string,
  QueryService: AbstractQueryService
) => {
  const item = await QueryService.detail(entity, id);

  const highestPositionIdx = await getHighestIdx(entity, QueryService);

  // update all position higher than the one deleted and decrement by one
  const n = highestPositionIdx - item.position;

  await updateAffectedRows(item, n, entity, QueryService);

  return await QueryService.delete(entity, id);
};

// crud operations
export const insertMultipleWithUpperBound = (
  QueryService: AbstractQueryService
) => async (
  entity: string,
  rows: Type.Row[],
  nmax: number = 500
): Promise<Type.InsertMultipleOut[]> => {
  let j = 0;

  const n: number = Math.ceil(rows.length / nmax);

  console.log(`the request will be divided in ${n} requests`);

  const r: Type.InsertMultipleOut[] = [];

  while (j < n) {
    const insertResponse: Type.MutateResponseInsert[] = await QueryService.insertMultiple(
      entity,
      rows.splice(0, nmax)
    );
    //const insertResponse = im[entity].insert as Type.MutateResponseInsert[]
    const c = insertResponse.filter((_) => _.success === true);
    const l = c.length;

    if (l > 0) {
      const bound: { min: number; max: number } = {
        min: c[0].id as number,
        max: c[l - 1].id as number,
      };
      r.push({ bound, length: l });
    } else {
      r.push({ length: l });
    }

    j += 1;
  }

  return r;
};
