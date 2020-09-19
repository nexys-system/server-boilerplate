import { App, Routes } from '@nexys/koa-lib';
import Mount from 'koa-mount';

import LibServices from './product-service';

// routes import
import Public from './routes/public';
// end routes import

const app = App();

app.use(Mount('/', Public));
app.use(Mount('/product', Routes.default(LibServices as any)));

export default app;
