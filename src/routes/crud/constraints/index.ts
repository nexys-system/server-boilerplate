import * as L from '@nexys/lib';
import {
  Role,
  roleKeys,
  constraintsProjection
} from '../../../common/generated/role';
import { Constraint, Profile } from './type';
import { getSuperadmin, getApp, getAdmin } from './default-constraints';

const getConstraintByRole = (r: Role, profile: Profile): Constraint => {
  if (r === Role.admin) {
    return getAdmin(profile);
  }

  if (r === Role.superadmin) {
    return getSuperadmin();
  }

  if (r === Role.app) {
    return getApp(profile);
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

export const constraintsByRole = (profile: Profile) =>
  new Map(roleKeys.map(r => [r, getConstraintByRole(r, profile)]));

export default constraintsByRole;
