import Router from 'koa-router';

import Authentication from './authentication';
import Permission from './permission';
import Main from './main';

const router = new Router();

router.use('/authentication', Authentication);
router.use('/permission', Permission);
router.use(Main);

export default router.routes();
