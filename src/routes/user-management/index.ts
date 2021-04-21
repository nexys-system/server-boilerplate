import * as services from '../../product-service';
import MiddlewareAuth from '../../middleware/auth';

import {
  Admin,
  Login,
  Profile,
  Superadmin
} from '@nexys/koa-lib/dist/routes/user-management';

const instance = {
  uuid: process.env.InstanceUuid || '',
  name: process.env.InstanceName || ''
};

const admin = Admin(services, MiddlewareAuth);
const login = Login(services, MiddlewareAuth, instance);
const profile = Profile(services, MiddlewareAuth);
const superadmin = Superadmin(services, MiddlewareAuth);

export { admin, login, profile, superadmin };
