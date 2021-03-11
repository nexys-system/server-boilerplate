import Router from 'koa-router';
import bodyParser from 'koa-body';

import LoginService from './login-service';
import { checkInputs, isSignupShape } from './middleware';

import MiddlewareAuth from '../../middleware/auth';

import * as LoginType from './type';

const router = new Router();

const instance = {
  uuid: process.env.InstanceUuid || '',
  name: process.env.InstanceName
};

const langDefault = { id: 1, name: 'en' };

router.post('/', bodyParser(), checkInputs, async ctx => {
  const { email, password } = ctx.request.body;

  try {
    const { profile, permissions } = await LoginService.authenticate(
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
  const profile = ctx.state.profile as LoginType.Profile;
  MiddlewareAuth.logout(profile, ctx);
  ctx.body = { message: 'logged out successfully' };
});

router.post('/signup', bodyParser(), isSignupShape, async ctx => {
  const { password, ...signupProfile }: LoginType.Signup = ctx.state.signup;
  const profile = {
    ...signupProfile,
    lang: langDefault.name,
    instance,
    logDateAdded: new Date()
  };

  try {
    ctx.body = await LoginService.signup(profile, password, ['app']);
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

  // todo: come up with real challenge
  const uuid = challenge;

  ctx.body = await LoginService.changeStatus(uuid, instance, 1);
});

export default router.routes();
