import Router from 'koa-router';

import Instance from './instance';
import User from './user';
import Main from './main';

const router = new Router();

router.use('/instance', Instance);
router.use('/user', User);
router.use(Main);

export default router.routes();
