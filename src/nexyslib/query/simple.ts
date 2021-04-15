import * as Request from "../request";
import QueryService from "./service";

class SimpleQueryService extends QueryService {
  async request(url: string, payload: any) {
    const { host, auth } = this;

    const options = {
      url: host + url,
      payload,
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    };

    return await Request.call(options);
  }
}

export default SimpleQueryService;
