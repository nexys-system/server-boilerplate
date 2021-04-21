import * as L from '@nexys/lib';
import {
  Role,
  roleKeys,
  constraintsProjection
} from '../../../common/generated/role';
import { Constraint } from './type';
import { getSuperadmin, getApp, getAdmin } from './default-constraints';

const getConstraintByRole = (r: Role): Constraint => {
  if (r === Role.admin) {
    return getAdmin();
  }

  if (r === Role.superadmin) {
    return getSuperadmin();
  }

  if (r === Role.app) {
    return getApp();
  }

  const projectionConstraints = constraintsProjection.get(r) || [];

  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map([]),
    projectionConstraintsMap: new Map(projectionConstraints)
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append: { instance: { uuid: process.env.instanceUuid } }
  };
  return { data, mutate };
};

export const constraintsByRole = new Map(
  roleKeys.map(r => [r, getConstraintByRole(r)])
);

export default constraintsByRole;
