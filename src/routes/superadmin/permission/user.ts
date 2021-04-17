import Router from 'koa-router';
import bodyParser from 'koa-body';

import { permissionService } from '../../../product-service';
import MiddlewareAuth from '../../../middleware/auth';
import Validation, { Utils as VU } from '@nexys/validation';
import { Uuid } from '@nexys/utils/dist/types';

const router = new Router();

router.post(
  '/list',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: {
      extraCheck: VU.checkUuid
    },
    instance: { uuid: { extraCheck: VU.checkUuid } }
  }),
  async ctx => {
    const { uuid, instance } = ctx.request.body;
    ctx.body = await permissionService.listByUserAssigned({ uuid, instance });
  }
);

router.post(
  '/toggle',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    user: { uuid: { extraCheck: VU.checkUuid } },
    permission: { uuid: { extraCheck: VU.checkUuid } },
    assigned: { type: 'boolean' }
  }),
  async ctx => {
    const {
      user,
      permission,
      assigned
    }: {
      user: { uuid: Uuid };
      permission: { uuid: Uuid };
      assigned: boolean;
    } = ctx.request.body;

    if (assigned) {
      ctx.body = await permissionService.revokeFromUser(permission.uuid, user);
      return;
    }

    ctx.body = await permissionService.assignToUser2(permission.uuid, user);
  }
);

export default router.routes();
