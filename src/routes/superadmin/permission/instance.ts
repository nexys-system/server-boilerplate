import Router from 'koa-router';
import bodyParser from 'koa-body';

import { permissionService } from '../../../product-service';
import MiddlewareAuth from '../../../middleware/auth';
import { isUuid } from '../../login/validation';
import Validation, { Utils as VU } from '@nexys/validation';
import { Uuid } from '@nexys/utils/dist/types';

const router = new Router();

router.post(
  '/list',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  isUuid,
  async ctx => {
    const { uuid } = ctx.request.body;
    ctx.body = await permissionService.listByInstanceAssigned({ uuid });
  }
);

router.post(
  '/toggle',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    instance: { uuid: { extraCheck: VU.checkUuid } },
    permission: { uuid: { extraCheck: VU.checkUuid } },
    assigned: { type: 'boolean' }
  }),
  async ctx => {
    const {
      instance,
      permission,
      assigned
    }: {
      instance: { uuid: Uuid };
      permission: { uuid: Uuid };
      assigned: boolean;
    } = ctx.request.body;

    if (assigned) {
      ctx.body = await permissionService.revokeFromInstance(
        [permission.uuid],
        instance
      );
      return;
    }

    ctx.body = await permissionService.assignToInstance(
      [permission.uuid],
      instance
    );
  }
);

export default router.routes();
