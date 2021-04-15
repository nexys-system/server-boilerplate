import ProductService from './index';
import QueryService from '../query';


class ProductQueryService extends QueryService {
  service:ProductService;

  constructor(host:string, auth:string) {
    super(host, auth);

    this.service = new ProductService(host, auth);
  }

  async request(uri:string, payload:any) {
    return await this.service.request('/query' + uri, payload);
  }
}

export default ProductQueryService;