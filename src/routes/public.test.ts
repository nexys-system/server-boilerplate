import supertest from 'supertest';
import app from '../app';

const myApp = app.listen();

const request = supertest(myApp);

afterAll(async done => {
  myApp.close();
  done();
});

describe('public endpoint', () => {
  it('should return 200 without session', async () => {
    const r = await request.get('/');
    expect(r.status).toEqual(200);
    expect(r.body).toEqual({
      app: 'boilerplate'
    });
  });
});
