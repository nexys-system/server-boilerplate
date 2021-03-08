import Router from 'koa-router';

const router = new Router();

const sha = process.env.SHA || 'sha not found in env var';

router.get('/', ctx => {
  ctx.body = { app: 'boilerplate', sha };
});

export default router.routes();
