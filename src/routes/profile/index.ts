import Router from 'koa-router';
import bodyParser from 'koa-body';

import MiddlewareAuth from '../../middleware/auth';
import Validation, { Utils as VU } from '@nexys/validation';

import { userService, passwordService } from '../../product-service';

const router = new Router();

router.all('/', bodyParser(), MiddlewareAuth.isAuthenticated(), async ctx => {
  ctx.body = ctx.state.profile;
});

router.post(
  '/update',
  bodyParser(),
  MiddlewareAuth.isAuthenticated(),
  Validation.isShapeMiddleware({
    firstName: {},
    lastName: {}
  }),
  async ctx => {
    const data: { firstName: string; lastName: string } = ctx.request.body;
    const { uuid } = ctx.state.profile;

    const r = await userService.update(uuid, data);

    if (!r.success) {
      throw Error('could not update the profile');
    }

    ctx.body = {
      message:
        'profile updated successfully, since the profile is in the cookie a refresh is necessary'
    };
  }
);

router.post(
  '/password/change',
  bodyParser(),
  MiddlewareAuth.isAuthenticated(),
  Validation.isShapeMiddleware({
    old: {},
    password: {}
  }),
  async ctx => {
    const data: { password: string; old: string } = ctx.request.body;
    const { uuid, instance } = ctx.state.profile;
    console.log(uuid, data.password, { uuid: instance.uuid }, data.old);
    const r = await passwordService.setPassword(
      uuid,
      data.password,
      { uuid: instance.uuid },
      data.old
    );
    ctx.body = r;
  }
);

export default router.routes();
