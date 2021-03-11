import Koa from 'koa';
import NUtils from '@nexys/utils';

const emailCheck = (email: string): string[] | undefined => {
  if (!NUtils.string.isEmail(email)) {
    return ['email invalid'];
  }
};

const passwordCheck = (password: string): string[] | undefined => {
  const r: string[] = [];
  if (password.length < 9) {
    r.push('password length smaller than 8');
  }

  return r.length > 0 ? r : undefined;
};

const stringCheckAssign = (
  value: any,
  err: { [k: string]: string[] },
  keyLabel: string,
  extraCheck?: (s: string) => string[] | undefined,
  fieldType: 'string' | 'number' | 'boolean' = 'string',
  errorLabel = 'This field is required'
): boolean => {
  if (!value || typeof value !== fieldType) {
    err[keyLabel] = [errorLabel];
    return false;
  }

  if (extraCheck) {
    const e = extraCheck(value);

    if (e) {
      err[keyLabel] = e;
      return false;
    }
  }

  return true;
};

export const checkInputs = async (ctx: Koa.Context, next: Koa.Next) => {
  const { email, password } = ctx.request.body;

  const err: { [k: string]: string[] } = {};

  stringCheckAssign(email, err, 'email', emailCheck);
  stringCheckAssign(password, err, 'password');

  if (Object.keys(err).length > 0) {
    ctx.body = err;
    ctx.status = 400;
    return;
  }

  await next();
};

const displayErrors = (err: { [k: string]: string[] }, ctx: Koa.Context) => {
  if (Object.keys(err).length > 0) {
    ctx.body = err;
    ctx.status = 400;
    return;
  }
};

export const isSignupShape = async (ctx: Koa.Context, next: Koa.Next) => {
  const err: { [k: string]: string[] } = {};
  const s = ctx.request.body;

  stringCheckAssign(s.firstName, err, 'firstName');
  stringCheckAssign(s.lastName, err, 'lastName');
  stringCheckAssign(s.email, err, 'email', emailCheck);
  stringCheckAssign(s.password, err, 'password', passwordCheck);

  if (Object.keys(err).length > 0) {
    displayErrors(err, ctx);
    return;
  }

  ctx.state.signup = s;

  await next();
};
