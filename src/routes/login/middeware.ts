import Koa from 'koa';
import NUtils from '@nexys/utils';

export const checkInputs = async (ctx: Koa.Context, next: Koa.Next) => {
  const { email, password } = ctx.request.body;

  const err: { [k: string]: string[] } = {};

  if (!email || typeof email !== 'string') {
    err.email = ['email required'];
  } else {
    if (!NUtils.string.isEmail(email)) {
      err.email = ['email invalid'];
    }
  }

  if (!password || typeof password !== 'string') {
    err.password = ['password required'];
  }

  if (Object.keys(err).length > 0) {
    ctx.body = err;
    ctx.status = 400;
    return;
  }

  await next();
};
