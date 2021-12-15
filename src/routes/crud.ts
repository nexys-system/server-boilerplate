import CrudRoutes from '@nexys/core/dist/routes/crud';
import P from '../product';
import model from '../model';

const crudRoutes = new CrudRoutes(model, P.qs, P.middlewareAuth);

export default crudRoutes.router.routes();
