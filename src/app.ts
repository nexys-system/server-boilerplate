import { App, Routes } from '@nexys/koa-lib';
import Mount from 'koa-mount';

import LibServices from './product-service';

// routes import
import Public from './routes/public';
import Login from './routes/login';
import Profile from './routes/profile';
import Crud from './routes/crud';
import Superadmin from './routes/superadmin';
// end routes import

const app = App();

app.use(Mount('/login', Login));
app.use(Mount('/profile', Profile));
app.use(Mount('/crud', Crud));
app.use(Mount('/superadmin', Superadmin));
app.use(Mount('/product', Routes.default(LibServices as any)));
app.use(Mount('/', Public));

export default app;
