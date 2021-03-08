import Router from 'koa-router';

const router = new Router();

router.get('/', ctx => {
  ctx.body = { app: 'boilerplate' };
});

export default router.routes();
