import supertest from 'supertest';
import app from '../../app';
import LoginService from './login-service';
import * as T from '@nexys/lib/dist/login/type';
import * as Config from '../../config';
import JWT from 'jsonwebtoken';

jest.mock('./login-service');

const permissions = ['app', 'admin'];
const profile: T.Profile = {
  uuid: 'myuuid',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  lang: 'en'
};

const mockAuth = LoginService.authenticate as jest.Mock;
mockAuth.mockImplementationOnce(() => {
  return { permissions, profile };
});

mockAuth.mockImplementationOnce(() => {
  throw new Error('myerror');
});

const myApp = app.listen();

const request = supertest(myApp);

afterAll(async done => {
  myApp.close();
  done();
});

describe('login endpoints', () => {
  it('should return 400', async () => {
    const r = await request.post('/login');
    expect(r.status).toEqual(400);
    expect(r.body).toEqual({
      email: ['email required'],
      password: ['password required']
    });
  });

  it('should return 400', async () => {
    const r = await request
      .post('/login')
      .send({ email: 'johndoe.com', password: 'apassword' });
    expect(r.status).toEqual(400);
    expect(r.body).toEqual({
      email: ['email invalid']
    });
  });

  it('should return 200 + JWT', async () => {
    const r = await request
      .post('/login')
      .send({ email: 'john@doe.com', password: 'apassword' });
    expect(r.status).toEqual(200);

    const {
      profile: { id, ...profileWOId },
      permissions
    } = r.body;

    expect(permissions).toEqual(permissions);
    expect(profileWOId).toEqual(profile);
  });

  it('should return 400 and login error', async () => {
    const r = await request
      .post('/login')
      .send({ email: 'john@doe.com', password: 'apassword' });
    expect(r.status).toEqual(400);

    expect(r.body).toEqual({
      error: 'myerror'
    });
  });
});
