import App from '@nexys/core/dist/app';
import Router from 'koa-router';

import MetaRoutes from '@nexys/core/dist/routes/product/meta';
import userManagementRoutes from './routes/user-management';

// replace crud with graphql
//import CrudRoutes from './routes/crud';
import GraphQLRoutes from './routes/graphql';

import PublicRoutes from './routes/public';

import * as Product from './product';

const app = App();
const router = new Router();

router.get('/email', async ctx => {
  await Product.email.findAndSend(
    '8f6a163e-bf8c-11ea-90f0-42010aac0009',
    'johan@nexys.ch',
    { link: 'http://hgfds.com' }
  );
  ctx.body = { hello: 'fd' };
});

router.use('/meta', MetaRoutes());
router.use(userManagementRoutes);
//router.use('/crud', CrudRoutes);
router.use("/graphql", GraphQLRoutes);
router.use(PublicRoutes);

router.get('/', ctx => {
  ctx.body = { hello: 'world' };
});

app.use(router.routes());

export default app;
