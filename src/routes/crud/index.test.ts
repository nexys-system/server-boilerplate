import supertest from 'supertest';
import app from '../../app';
import LoginService from '../login/login-service';
import * as T from '@nexys/lib/dist/login/type';
import P from '../../product-service';
import * as L from '@nexys/lib';

jest.mock('../login/login-service');
jest.mock('../../product-service');

const mockQueryData = P.ProductQuery.dataWithConstraint as jest.Mock;
mockQueryData.mockImplementation(() => {
  return {};
});

const mockQueryMutate = P.ProductQuery.mutateWithConstraint as jest.Mock;
mockQueryMutate.mockImplementation(() => {
  return { status: 200, body: {} };
});

const myApp = app.listen();

const request = supertest(myApp);
let cookies: string[] = [];

beforeAll(async () => {
  const permissions = ['app', 'admin'];
  const profile: T.Profile = {
    uuid: 'myuuid',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    lang: 'en',
    instance: { uuid: 'my', name: 'instance' }
  };
  const mockAuth = LoginService.authenticate as jest.Mock;
  mockAuth.mockImplementationOnce(() => {
    return { permissions, profile };
  });
  const response = await request
    .post('/login')
    .send({ email: 'john@doe.com', password: 'apassword' });

  cookies = response.header['set-cookie'];
});

afterAll(async () => {
  myApp.close();
});

describe('crud query endpoint', () => {
  it('should return 401', async () => {
    const r = await request.post('/crud/query').send({});

    expect(r.status).toEqual(401);
  });

  it('should return 200 ', async () => {
    const r = await request.post('/crud/query').send({}).set('Cookie', cookies);

    expect(r.status).toEqual(200);
  });
});

describe('crud mutate endpoint', () => {
  it('should return 401', async () => {
    const r = await request.post('/crud/query').send({});

    expect(r.status).toEqual(401);
  });

  it('should return 200 (mutate insert)', async () => {
    const q: L.Query.Type.Mutate = {
      User: { insert: { data: { name: 'fds' } } }
    };

    const r = await request.post('/crud/mutate').send(q).set('Cookie', cookies);

    expect(r.status).toEqual(200);
  });
});
