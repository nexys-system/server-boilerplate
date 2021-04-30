import Lib, { UserManagement } from '@nexys/lib';
import { product, inProd } from './config';

const { token } = product;

const init = Lib({ authToken: token, host: 'https://flow.nexys.io' });
const subscribe = inProd || false;
// subscribe to product service
if (subscribe) {
  init.Product.subscribe(true).then(x => {
    console.log('Subscribe output: ' + JSON.stringify(x));
  });
}

// this should be unique by project and should be regenerated
const aesSecret = 'fneusjwfBShfhwudhglkfnQQbnjkbd65';

const loginService = new UserManagement.LoginService(
  init.ProductQuery,
  aesSecret
);
const userService = new UserManagement.UserService(init.ProductQuery);
const instanceService = new UserManagement.InstanceService(init.ProductQuery);
const passwordService = new UserManagement.PasswordService(
  init.ProductQuery,
  aesSecret
);
const permissionService = new UserManagement.PermissionService(
  init.ProductQuery
);

const userAuthenticationService = new UserManagement.UserAuthentication(
  init.ProductQuery
);

const services = {
  loginService,
  userService,
  instanceService,
  passwordService,
  permissionService,
  userAuthenticationService
};

export {
  services,
  loginService,
  userService,
  instanceService,
  passwordService,
  permissionService,
  userAuthenticationService
};

export default init;
