// Collection of types associated with querying

import { Id, Uuid } from "@nexys/utils/dist/types";

// Query validation
// https://github.com/Nexysweb/digis-ddl/blob/master/src/lib/query-validation.jshttps://github.com/Nexysweb/digis-ddl/blob/master/src/lib/query-validation.js

// merge with the following?

export interface Projection {
  [attr: string]: boolean | Projection;
}

interface FiltersIn {
  $in: (number | string | boolean | Date)[];
}

interface FiltersNe {
  $ne: null | number | string | boolean | Date;
}

export type FilterAttribute =
  | string
  | boolean
  | number
  | Date
  | FiltersIn
  | FiltersNe
  | Filters
  | null;

export interface Filters {
  [attr: string]: FilterAttribute;
}

export interface References {
  [entity: string]: Params & {joinOn?: string};
}

export interface Params {
  filters?: Filters;
  projection?: Projection;
  references?: References;
  order?: { by: string; desc?: boolean };
  take?: number;
  skip?: number;
}

export interface Query {
  [entity: string]: Params;
}

export interface QueryResponse<A = any> {
  [entity: string]: A[];
}

interface Ids {
  id: Id;
  uuid: Uuid;
}

export interface Mutate<A = any> {
  [entity: string]: MutateParams<A>;
}

export interface MutateParams<A = any> {
  insert?: {
    data: Omit<A, keyof Ids> | Omit<A, keyof Ids>[];
  };
  update?: {
    filters?: Filters;
    data: Partial<Omit<A, keyof Ids>>;
  };
  delete?: {
    filters: Filters;
  };
}

export interface MutateResponseInsert {
  success: boolean;
  uuid?: string;
  id?: number;
  status?: string;
}

export interface MutateResponseUpdate {
  success: boolean;
  updated: number;
}

export interface MutateResponseDelete {
  success: boolean;
  deleted: number;
}

export interface MutateResponse {
  [entity: string]: {
    insert?: MutateResponseInsert | MutateResponseInsert[];
    update?: MutateResponseUpdate;
    delete?: MutateResponseDelete; //| MutateResponseDelete[]; for now remove this one (I don't think it is implemented anyway)
  };
}

export interface withPosition {
  [key: string]: any;
  position: number;
}

export interface Row {
  [key: string]: any;
}

export interface InsertMultipleOut {
  bound?: { min: number; max: number };
  length: number;
}

// constraints

export interface ProjectionConstraint {
  attribute: string;
}

export interface FilterConstraint extends ProjectionConstraint {
  filterAttribute: FilterAttribute;
}

export interface DataConstraint extends ProjectionConstraint {
  dataAttribute: FilterAttribute;
}

export interface QueryConstraint {
  filterConstraintsMap: Map<string, FilterConstraint[]>;
  projectionConstraintsMap: Map<string, ProjectionConstraint[]>;
}

export interface MutateConstraint {
  filterConstraintsMap: Map<string, FilterConstraint[]>;
  dataConstraintsMap: Map<string, DataConstraint[]>;
  append: Object;
}

// contraints end
