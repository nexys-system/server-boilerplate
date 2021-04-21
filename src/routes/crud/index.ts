import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import * as L from '@nexys/lib';
import P from '../../product-service';
import Auth from '../../middleware/auth';

import { middlewareRoleExists } from './utils';

const router: Router = new Router();

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

    ctx.body = await P.ProductQuery.dataWithConstraint(query, constraints.data);
  }
);

router.post(
  '/mutate/:role',
  bodyParser(),
  Auth.isAuthenticated(),
  middlewareRoleExists,
  async (ctx: Koa.Context) => {
    const { constraints } = ctx.state as {
      constraints: {
        data: L.Query.Type.QueryConstraint;
        mutate: L.Query.Type.MutateConstraint;
      };
    };

    const query: L.Query.Type.Mutate = ctx.request.body;
    const response = await P.ProductQuery.mutateWithConstraint(
      query,
      constraints.mutate
    );

    ctx.status = response.status;
    ctx.body = response.body;
  }
);

export default router.routes();
