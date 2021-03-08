import { Middleware } from '@nexys/koa-lib';
import * as Login from '../routes/login/type';
import cache from '../services/cache';

import { jwtToken } from '../config';

// initalises the middleware auth with
// - `Profile` defines the JWT Profile shape
// - `UserCache` defines the shape of the information saved in the userCache
// - `cache`reference to the cache
export default new Middleware.Auth<Login.Profile, Login.UserCache>(
  cache,
  jwtToken
);
