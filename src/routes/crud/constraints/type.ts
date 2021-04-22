import * as L from '@nexys/lib';
import { Uuid } from '@nexys/utils/dist/types';

export interface Constraint {
  data: L.Query.Type.QueryConstraint;
  mutate: L.Query.Type.MutateConstraint;
}

export interface Profile {
  uuid: Uuid;
  instance: { uuid: Uuid };
}
