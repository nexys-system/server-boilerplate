import Service from '../service';
import * as Request from '../request';

import HTTP from '@nexys/http';

import * as T from '../request/types';

class ProductService extends Service {
  constructor(host: string, auth: string) {
    super(host, auth);
  }

  async request(
    uri: string,
    payload: any = null,
    headers: { [k: string]: string } = {}
  ): Promise<any> {
    // TODO: change position of multipart
    const options: T.Options = {
      url: this.host + uri,
      payload,
      headers: {
        ...headers,
        'content-type': 'application/json',
        'app-token': this.auth
      }
    };

    try {
      return await Request.call(options);
    } catch (err) {
      throw err;
      /*  throw new HTTP.Error(
        {
          message: `An error occurred while calling the product service: ${err.message}`,
          ...err.body,
        },
        err.status
      );*/
    }
  }

  /**
   * init the product service with the data def etc
   * @param instance: true: refreshed the data that's saved at instance level (workflow, requests etc)
   */
  subscribe = (instance: boolean = false): Promise<{ message: string }> =>
    this.request('/app/subscribe' + (instance ? '?instance=true' : ''));

  getSubscribe = (): Promise<any> => this.request('/app/get');

  ensureSubscribed = async (
    instance: boolean = false
  ): Promise<{ message: string }> => {
    try {
      return await this.getSubscribe();
    } catch (err) {
      if (err.body && err.body.message === 'Not configured') {
        try {
          return await this.subscribe(instance);
        } catch (err) {
          throw new HTTP.Error('Failed to ensure subscription');
        }
      }

      throw new HTTP.Error('Failed to ensure subscription2');
    }
  };
}

export default ProductService;
