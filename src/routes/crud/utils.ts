import Koa from 'koa';

import * as R from '../../common/generated/role';
import Constraints from './constraints';

export const middlewareRoleExists = async (
  ctx: Koa.Context,
  next: Koa.Next
) => {
  // extract role
  const { role }: { role?: string } = ctx.params;

  // map role to the enum Role
  const rIdx: R.Role = R.roles.indexOf(role || '');

  if (rIdx < 0 || !role) {
    ctx.body = { error: 'this role does not exist' };
    ctx.status = 404;
    return;
  }

  // make sure the useer is authenticated
  const { userCache } = ctx.state;
  // and has the permission of value `role`
  if (
    !userCache ||
    !userCache.permissions ||
    !Array.isArray(userCache.permissions) ||
    !userCache.permissions.includes(role)
  ) {
    ctx.body = { error: 'unauthorized' };
    ctx.status = 401;
    return;
  }

  // get the constraints associated with the role
  const constraints = Constraints.get(rIdx);

  if (!constraints) {
    ctx.body = { error: 'no constraints associated with this role' };
    ctx.status = 500;
    return;
  }

  // add constraints to the state so it can be used downstream
  ctx.state.constraints = constraints;

  await next();
};
