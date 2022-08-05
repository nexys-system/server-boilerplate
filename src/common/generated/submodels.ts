import * as T from './type';
import { QueryFilters, QueryProjection } from "@nexys/fetchr/dist/type";

interface ModelConstraints { [entity: string]: { projection?: QueryProjection; filters?: QueryFilters } }

const submodels: [
    T.Permissions,
    (v: { Instance: string | number; User: string | number }) => ModelConstraints
  ][] = [];

export default submodels;