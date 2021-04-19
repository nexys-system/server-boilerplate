import { Middleware } from '@nexys/koa-lib'; //'/srv/@nexys-koa-lib/dist';
import * as Login from '../routes/user-management/type';
import cache from '../services/cache';

import { jwtSecret } from '../config';
import { Uuid } from '@nexys/utils/dist/types';

// initalises the middleware auth with
// - `Profile` defines the JWT Profile shape
// - `UserCache` defines the shape of the information saved in the userCache
// - `cache`reference to the cache
export default new Middleware.Auth<Login.Profile, Login.UserCache, Uuid>(
  cache,
  jwtSecret
);
