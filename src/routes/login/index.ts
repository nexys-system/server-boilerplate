import Router from 'koa-router';
import bodyParser from 'koa-body';

import LoginService from './login-service';
import { checkInputs } from './middleware';

import MiddlewareAuth from '../../middleware/auth';

const router = new Router();

const instance = { uuid: 'f12f49fa-7b3b-11eb-9846-42010aac0033' };

router.post('/', bodyParser(), checkInputs, async ctx => {
  const { email, password } = ctx.request.body;

  try {
    const { profile, permissions } = await LoginService.authenticate(
      email,
      password,
      instance
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

router.post('/signup', bodyParser(), async ctx => {
  const profile = {
    firstName: 'a',
    lastName: 'l',
    email: 'a3@gfd.com',
    lang: 'en',
    instance,
    logDateAdded: new Date()
  };
  const password = 'mypassing';
  try {
    ctx.body = await LoginService.signup(profile as any, password, ['app']);
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
