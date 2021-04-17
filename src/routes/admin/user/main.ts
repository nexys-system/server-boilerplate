import Router from 'koa-router';
import bodyParser from 'koa-body';

import { userService } from '../../../product-service';
import MiddlewareAuth from '../../../middleware/auth';
import Validation, { Utils as VU } from '@nexys/validation';
import { Uuid, Id } from '@nexys/utils/dist/types';

import * as CT from '../../../services/crud/type';
type Profile = Pick<CT.User, 'firstName' | 'lastName' | 'email' | 'lang'>;

const router = new Router();

router.all(
  '/list',
  bodyParser(),
  MiddlewareAuth.isAuthorized('admin'),
  async ctx => {
    const { instance } = ctx.state.profile;
    ctx.body = await userService.list(instance);
  }
);

router.post(
  '/detail',
  bodyParser(),
  MiddlewareAuth.isAuthorized('admin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid }
  }),
  async ctx => {
    const { uuid } = ctx.request.body;
    const { instance } = ctx.state.profile;
    ctx.body = await userService.detail(uuid, instance);
  }
);

router.post(
  '/insert',
  bodyParser(),
  MiddlewareAuth.isAuthorized('admin'),
  Validation.isShapeMiddleware({
    firstName: {},
    lastName: {},
    email: { extraCheck: VU.emailCheck },

    status: { id: { type: 'number' } },
    lang: {}
  }),
  async ctx => {
    const user: Profile & {
      status: { id: Id };
    } = ctx.request.body;
    const { instance } = ctx.state.profile;
    ctx.body = await userService.insert({
      ...user,
      instance,
      logDateAdded: new Date()
    });
  }
);

router.post(
  '/update',
  bodyParser(),
  MiddlewareAuth.isAuthorized('admin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    firstName: {},
    lastName: {},
    email: { extraCheck: VU.emailCheck }
  }),
  async ctx => {
    const {
      uuid,
      ...profile
    }: {
      uuid: Uuid;
    } & Partial<Profile> = ctx.request.body;
    ctx.body = await userService.update(uuid, profile); // todo add instance!
  }
);

router.post(
  '/delete',
  bodyParser(),
  MiddlewareAuth.isAuthorized('admin'),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid }
  }),
  async ctx => {
    const { uuid } = ctx.request.body;

    ctx.request.body = ctx.body = await userService.delete(uuid);
  }
);

router.post(
  '/status/change',
  bodyParser(),
  MiddlewareAuth.isAuthorized('admin'),
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
