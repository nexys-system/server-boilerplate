import * as L from '@nexys/lib';

export interface Constraint {
  data: L.Query.Type.QueryConstraint;
  mutate: L.Query.Type.MutateConstraint;
}
