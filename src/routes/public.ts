import Router from 'koa-router';

const router = new Router();

router.all('/', ctx => {
  ctx.body = { app: 'boilerplate' };
});

export default router.routes();
