import Router from 'koa-router';
import bodyParser from 'koa-body';

import { userService } from '../../product-service';
import MiddlewareAuth from '../../middleware/auth';
import Validation, { Utils as VU } from '@nexys/validation';
import { Uuid, Id } from '@nexys/utils/dist/types';

import * as CT from '../../services/crud/type';
type Profile = Pick<CT.User, 'firstName' | 'lastName' | 'email' | 'lang'>;

const router = new Router();

router.post(
  '/list',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({ uuid: { extraCheck: VU.checkUuid } }),
  async ctx => {
    const { instance } = ctx.request.body;
    ctx.body = await userService.list(instance);
  }
);

router.post(
  '/detail',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    instance: { uuid: { extraCheck: VU.checkUuid } }
  }),
  async ctx => {
    const { uuid, instance } = ctx.request.body;
    ctx.body = await userService.detail(uuid, instance);
  }
);

router.post(
  '/insert',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    firstName: {},
    lastName: {},
    email: { extraCheck: VU.emailCheck },
    instance: { uuid: { extraCheck: VU.checkUuid } },
    status: { id: { type: 'number' } },
    lang: {}
  }),
  async ctx => {
    const user: Profile & {
      instance: { uuid: Uuid };
      status: { id: Id };
    } = ctx.request.body;
    ctx.body = await userService.insert({ ...user, logDateAdded: new Date() });
  }
);

router.post(
  '/update',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    instance: { uuid: { extraCheck: VU.checkUuid } },
    firstName: {},
    lastName: {},
    email: { extraCheck: VU.emailCheck },
    status: { id: { type: 'number' } },
    lang: {}
  }),
  async ctx => {
    const {
      uuid,
      instance,
      ...profile
    }: {
      uuid: Uuid;
      instance: { uuid: Uuid };
    } & Partial<Profile> = ctx.request.body;
    ctx.body = await userService.update(uuid, profile); // todo add instance!
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

    ctx.request.body = ctx.body = await userService.delete(uuid);
  }
);

router.post(
  '/exists',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    email: { extraCheck: VU.emailCheck },
    instance: { uuid: { extraCheck: VU.checkUuid } }
  }),
  async ctx => {
    const { name } = ctx.request.body;
    ctx.body = await userService.getByEmail(name);
  }
);

router.post(
  '/status/change',
  bodyParser(),
  MiddlewareAuth.isAuthorized('superadmin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    status: { id: { type: 'number', extraCheck: VU.checkId } }
  }),
  async ctx => {
    const {
      uuid,
      status
    }: { uuid: Uuid; status: { id: Id } } = ctx.request.body;
    ctx.body = await userService.changeStatus(uuid, status.id);
  }
);

export default router.routes();
