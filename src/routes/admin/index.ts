import Router from 'koa-router';

import User from './user';

const router = new Router();

router.use('/user', User);

export default router.routes();
