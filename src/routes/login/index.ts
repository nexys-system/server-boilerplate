import Router from 'koa-router';
import bodyParser from 'koa-body';

import { loginService } from '../../product-service';
import { checkLogin, isSignupShape } from './validation';

import MiddlewareAuth from '../../middleware/auth';

import * as LoginType from './type';

const router = new Router();

const instance = {
  uuid: process.env.InstanceUuid || '',
  name: process.env.InstanceName || ''
};

const langDefault = { id: 1, name: 'en' };

router.post('/', bodyParser(), checkLogin, async ctx => {
  const { email, password } = ctx.request.body;

  try {
    const { profile, permissions } = await loginService.authenticate(
      email,
      password,
      instance
    );
    const lang = langDefault;

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

router.all('/logout', MiddlewareAuth.isAuthenticated(), async ctx => {
  const profile = ctx.request.body as LoginType.Profile;
  MiddlewareAuth.logout(profile, ctx);
  ctx.body = { message: 'logged out successfully' };
});

router.post('/signup', bodyParser(), isSignupShape, async ctx => {
  const { password, ...signupProfile }: LoginType.Signup = ctx.request.body;
  const profile = {
    ...signupProfile,
    lang: langDefault.name,
    instance,
    logDateAdded: new Date()
  };

  try {
    const { uuid, token } = await loginService.signup(profile, password, [
      'app'
    ]);

    console.log('should send email with ' + token);

    ctx.body = { uuid };
  } catch (err) {
    console.log(err);
    ctx.body = err;
  }
});

router.all('/activate', async ctx => {
  const { challenge } = ctx.query;

  if (!challenge) {
    ctx.status = 400;
    ctx.body = { error: 'challenge must be given' };
    return;
  }

  ctx.body = await loginService.activate(challenge);
});

export default router.routes();
