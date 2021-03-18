import PS from '../../product-service';
import * as T from '@nexys/lib/dist/login/type';
jest.mock('../../product-service');

export const userUuid = 'myUuid';
export const email = 'john@doe.com';

export const permissions = ['app', 'admin'];
export const profile: T.Profile = {
  uuid: userUuid,
  firstName: 'John',
  lastName: 'Doe',
  email,
  lang: 'en'
};

export const status = T.Status.pending;

export const hashedPassword = 'myhashedpassword';

const mockListPermissions = PS.ProductQuery.list as jest.Mock;
const mockFindPermissions = PS.ProductQuery.list as jest.Mock;
mockListPermissions.mockImplementation((entity, _query) => {
  if (entity === 'UserPermission') {
    return [{ permission: { name: 'app' } }, { permission: { name: 'admin' } }];
  }
});

mockFindPermissions.mockImplementation((entity, _query) => {
  if (entity === 'User') {
    return {
      ...profile,
      status,
      UserAuthentication: [
        {
          username: hashedPassword,
          type: { name: 'password' },
          isEnabled: true
        }
      ]
    };
  }
});
