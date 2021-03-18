import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import * as L from '@nexys/lib';
import P from '../../product-service';
import Auth from '../../middleware/auth';

const router: Router = new Router();

const constraintsSchema: L.Query.Type.QueryConstraint = {
  filterConstraintsMap: new Map(),
  projectionConstraintsMap: new Map()
};

const mutateConstraintsSchema: L.Query.Type.MutateConstraint = {
  filterConstraintsMap: new Map(),
  dataConstraintsMap: new Map(),
  append: {}
};

router.post(
  '/query',
  bodyParser(),
  Auth.isAuthenticated(),
  Auth.hasPermission('app'),
  async (ctx: Koa.Context) => {
    //const profile: any = ctx.state.profile as LoginType.Profile;
    const query: L.Query.Type.Query = ctx.request.body;

    ctx.body = await P.ProductQuery.dataWithConstraint(
      query,
      constraintsSchema
    );
  }
);

router.post(
  '/mutate',
  bodyParser(),
  Auth.isAuthenticated(),
  Auth.hasPermission('app'),
  async (ctx: Koa.Context) => {
    //    const profile: any = ctx.state.profile as LoginType.Profile;
    const query: L.Query.Type.Mutate = ctx.request.body;
    const response = await P.ProductQuery.mutateWithConstraint(
      query,
      mutateConstraintsSchema
    );

    ctx.status = response.status;
    ctx.body = response.body;
  }
);

export default router.routes();
