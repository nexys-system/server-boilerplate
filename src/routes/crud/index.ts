import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import * as L from '@nexys/lib';
import P from '../../product-service';
import Auth from '../../middleware/auth';

import * as R from '../../common/generated/role';
import Constraints from './constraints';
import * as CD from '@nexys/lib/dist/query/constraint/query-builder/data';

const router: Router = new Router();

const middlewareRoleExists = async (ctx: Koa.Context, next: Koa.Next) => {
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

router.post(
  '/query/:role',
  bodyParser(),
  Auth.isAuthenticated(),
  middlewareRoleExists,
  async (ctx: Koa.Context) => {
    const query: L.Query.Type.Query = ctx.request.body;

    const { constraints } = ctx.state as {
      constraints: {
        data: L.Query.Type.QueryConstraint;
        mutate: L.Query.Type.MutateConstraint;
      };
    };

    console.log(constraints.data.filterConstraintsMap);

    CD.constructQueryPermission(
      query,
      constraints.data.filterConstraintsMap,
      constraints.data.projectionConstraintsMap
    );

    console.log(query);

    ctx.body = await P.ProductQuery.dataWithConstraint(
      query,
      ctx.state.constraints.data
    );
  }
);

router.post(
  '/mutate',
  bodyParser(),
  Auth.isAuthenticated(),
  Auth.hasPermission('app'),
  middlewareRoleExists,
  async (ctx: Koa.Context) => {
    //    const profile: any = ctx.state.profile as LoginType.Profile;
    const query: L.Query.Type.Mutate = ctx.request.body;
    const response = await P.ProductQuery.mutateWithConstraint(
      query,
      ctx.state.constraints.mutate
    );

    ctx.status = response.status;
    ctx.body = response.body;
  }
);

export default router.routes();
