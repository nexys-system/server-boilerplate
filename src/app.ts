import { App, Routes } from '@nexys/koa-lib';
import Mount from 'koa-mount';

import LibServices from './product-service';

// routes import
import Public from './routes/public';
import Crud from './routes/crud';
import { admin, login, profile, superadmin } from './routes/user-management';

// end routes import

const app = App();

app.use(Mount('/login', login));
app.use(Mount('/profile', profile));
app.use(Mount('/crud', Crud));
app.use(Mount('/superadmin', superadmin));
app.use(Mount('/admin', admin));
app.use(Mount('/product', Routes.default(LibServices as any)));
app.use(Mount('/', Public));

export default app;
