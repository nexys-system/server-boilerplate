import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import { graphql, printSchema } from 'graphql';
import Auth from '../../middleware/auth';
import * as G from './g';

const router: Router = new Router();

router.all(
  '/schema',
  bodyParser(),
  Auth.isAuthorized('superadmin'),
  //middlewareRoleExists,
  async (ctx: Koa.Context) => {
    ctx.body = printSchema(G.schema);
  }
);

router.post(
  '/',
  bodyParser(),
  Auth.isAuthorized('superadmin'),
  //middlewareRoleExists,
  async (ctx: Koa.Context) => {
    const { body } = ctx.request;
    const { query } = body;
    ctx.body = await graphql(G.schema, query);
  }
);

export default router.routes();
