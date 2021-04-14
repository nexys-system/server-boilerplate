import Router from 'koa-router';
import bodyParser from 'koa-body';

import { permissionService } from '../../product-service';
import MiddlewareAuth from '../../middleware/auth';
import { isUuid } from '../login/validation';
import Validation, { Utils as VU } from '@nexys/koa-validation';
import { Uuid } from '@nexys/utils/dist/types';

const router = new Router();

router.get(
  '/list',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  async ctx => {
    ctx.body = await permissionService.list();
  }
);

router.post(
  '/detail',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  isUuid,
  async ctx => {
    const { uuid } = ctx.state.body;
    ctx.body = await permissionService.detail(uuid);
  }
);

router.post(
  '/insert',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    name: {}
  }),
  async ctx => {
    const { name }: { name: string } = ctx.request.body;
    ctx.body = await permissionService.insert(name);
  }
);

router.post(
  '/update',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    name: {}
  }),
  async ctx => {
    const { uuid, name }: { uuid: Uuid; name: string } = ctx.state.body;
    ctx.body = await permissionService.update(uuid, name);
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
    const { uuid }: { uuid: Uuid } = ctx.state.body;

    ctx.request.body = ctx.body = await permissionService.delete(uuid);
  }
);

export default router.routes();
