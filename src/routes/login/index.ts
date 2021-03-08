import Router from 'koa-router';
import bodyParser from 'koa-body';

import LoginService from './login-service';
import { checkInputs } from './middleware';

import MiddlewareAuth from '../../middleware/auth';

const router = new Router();

router.post('/', bodyParser(), checkInputs, async ctx => {
  const { email, password } = ctx.request.body;

  try {
    const { profile, permissions } = await LoginService.authenticate(
      email,
      password
    );
    const lang = { id: 1, name: 'en' };

    const nProfile = { id: profile.uuid, ...profile };

    return MiddlewareAuth.authOutput(ctx, nProfile, { permissions }, lang, {
      secure: false
    });
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: err.message };
    return;
  }
});

export default router.routes();
