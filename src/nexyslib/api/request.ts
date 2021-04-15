import ProductService from "../product";

export default class RequestService extends ProductService {
  async exec(
    uuid: string,
    p: {
      data: any | undefined;
      params: any | undefined;
      headers: any | undefined;
    } = { data: undefined, params: undefined, headers: undefined }
  ) {
    const { data, params, headers } = p;
    const payload = {
      uuid,
      data,
      params,
    };

    return this.request("/api/request", payload, headers);
  }
}
