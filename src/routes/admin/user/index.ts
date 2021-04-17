import Router from 'koa-router';

import Authentication from './authentication';
import Main from './main';

const router = new Router();

router.use('/authentication', Authentication);
router.use(Main);

export default router.routes();
