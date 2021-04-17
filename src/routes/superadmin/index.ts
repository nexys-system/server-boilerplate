import Instance from './instance';
import User from './user';
import Permission from './permission';

import Router from 'koa-router';

const router = new Router();

router.use('/instance', Instance);
router.use('/user', User);
router.use('/permission', Permission);

export default router.routes();
