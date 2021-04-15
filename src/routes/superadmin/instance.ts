import Router from 'koa-router';
import bodyParser from 'koa-body';

import { instanceService } from '../../product-service';
import MiddlewareAuth from '../../middleware/auth';
import { isUuid } from '../login/validation';
import Validation, { Utils as VU } from '@nexys/validation';

const router = new Router();

router.get(
  '/list',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  async ctx => {
    ctx.body = await instanceService.list();
  }
);

router.post(
  '/detail',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  isUuid,
  async ctx => {
    const { uuid } = ctx.request.body;
    ctx.body = await instanceService.detail(uuid);
  }
);

router.post(
  '/insert',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    name: {},
    dateAdded: { type: 'string' }
  }),
  async ctx => {
    const { name } = ctx.request.body;
    ctx.body = await instanceService.insert(name);
  }
);

router.post(
  '/update',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    name: {},
    dateAdded: { type: 'string' }
  }),
  async ctx => {
    const { uuid, name } = ctx.request.body;
    ctx.body = await instanceService.update(uuid, name);
  }
);

router.post(
  '/delete',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid }
  }),
  async ctx => {
    const { uuid } = ctx.request.body;

    ctx.request.body = ctx.body = await instanceService.delete(uuid);
  }
);

router.post(
  '/exists',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    name: {}
  }),
  async ctx => {
    const { name } = ctx.request.body;
    ctx.body = await instanceService.exists(name);
  }
);

export default router.routes();
