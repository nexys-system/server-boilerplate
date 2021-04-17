import Router from 'koa-router';
import bodyParser from 'koa-body';

import { userAuthenticationService } from '../../../product-service';
import MiddlewareAuth from '../../../middleware/auth';
import Validation, { Utils as VU } from '@nexys/validation';

import * as CT from '../../../services/crud/type';

const router = new Router();

router.post(
  '/list',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({ uuid: { extraCheck: VU.checkUuid } }),
  async ctx => {
    const { uuid } = ctx.request.body;
    ctx.body = await userAuthenticationService.list({ uuid });
  }
);

router.post(
  '/detail',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid }
  }),
  async ctx => {
    const { uuid } = ctx.request.body;
    ctx.body = await userAuthenticationService.detail(uuid);
  }
);

router.post(
  '/insert',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware(
    {
      type: { id: { type: 'number' } },
      value: {},
      isEnabled: { type: 'boolean' },
      user: { uuid: { extraCheck: VU.checkUuid } }
    },
    false
  ),
  async ctx => {
    const user: Pick<
      CT.UserAuthentication,
      'type' | 'value' | 'isEnabled' | 'user'
    > = ctx.request.body;
    ctx.body = await userAuthenticationService.insert(user);
  }
);

router.post(
  '/update',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    type: { id: { type: 'number' } },
    value: {},
    isEnabled: { type: 'boolean' }
  }),
  async ctx => {
    const {
      uuid,
      ...data
    }: Pick<
      CT.UserAuthentication,
      'uuid' | 'type' | 'value' | 'isEnabled'
    > = ctx.request.body;
    ctx.body = await userAuthenticationService.update(uuid, data); // todo add instance!
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

    ctx.request.body = ctx.body = await userAuthenticationService.delete(uuid);
  }
);

export default router.routes();
