import L from '@nexys/lib/dist/login';
import PS from '../../product-service';
const LoginService = new L(PS.ProductQuery);

export default LoginService;
