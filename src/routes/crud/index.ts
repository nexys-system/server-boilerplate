import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import { Middleware } from '@nexys/koa-lib';
import * as L from '@nexys/lib';
import P from '../../product-service';

const { handleResponse } = Middleware;
const router: Router = new Router();

const constraintsSchema: L.Query.Type.QueryConstraint = {
  filterConstraintsMap: new Map(),
  projectionConstraintsMap: new Map()
};

const profile = { id: 1, userCache: { constraintsSchema } };

router.post(
  '/query',
  bodyParser(),
  //Auth.isAuthenticated(),
  async (ctx: Koa.Context) => {
    //const profile: any = ctx.state; //as LoginType.Session;
    const query: L.Query.Type.Query = ctx.request.body;

    try {
      const constraints = profile.userCache.constraintsSchema;

      const r = () =>
        P.ProductQuery.dataWithConstraint(
          query,
          constraints as L.Query.Type.QueryConstraint
        );
      await handleResponse(r, ctx);
    } catch (err) {
      console.log(err);
      ctx.body = 'err';
    }
  }
);

router.post(
  '/mutate',
  bodyParser(),
  //Auth.isAuthenticated(),
  async (ctx: Koa.Context) => {
    const { id }: { id: number } = profile;
    const query: L.Query.Type.Mutate = ctx.request.body;

    Object.keys(query).map(entity => {
      const q = query[entity];
      const insert = q.insert;
      if (insert) {
        const data: any = insert.data;
        data.logDateAdded = new Date();
        data.logUser = { id };
        data.logIsLog = false;
      }
    });
    try {
      const r = await P.ProductQuery.mutate(query);
      let err = 0;
      Object.keys(r).map(entity => {
        const a = r[entity];
        if (a.insert && !Array.isArray(a.insert)) {
          const { success, status } = a.insert;
          if (success === false && status) {
            ctx.status = 400;
            ctx.body = L.Query.Constraint.formatErrors(status);
            // TODO
            // ctx.body('something went wrong');
            err += 1;
            return;
          }
        }
      });
      if (err === 0) {
        ctx.body = r;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = 'internal server error when querying mutate';
    }
  }
);

export default router.routes();
