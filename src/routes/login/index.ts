import Router from 'koa-router';
import bodyParser from 'koa-body';
import * as Config from '../../config';
import LoginService from './login-service';
import { checkInputs } from './middeware';

const router = new Router();

router.post('/', bodyParser(), checkInputs, async ctx => {
  const { email, password } = ctx.request.body;

  try {
    const loginResult = await LoginService.authenticate(email, password);

    const jwtToken = Config.jwt.sign(loginResult);

    ctx.body = { token: jwtToken, ...loginResult };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: err.message };
    return;
  }
});

export default router.routes();
