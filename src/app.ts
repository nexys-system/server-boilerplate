import { App, Routes } from '@nexys/koa-lib';
import Mount from 'koa-mount';

import LibServices from './product-service';

// routes import
import Public from './routes/public';
import Login from './routes/login';
import Crud from './routes/crud';
// end routes import

const app = App();

app.use(Mount('/', Public));
app.use(Mount('/login', Login));
app.use(Mount('/crud', Crud));
app.use(Mount('/product', Routes.default(LibServices as any)));

export default app;
