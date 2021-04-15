import ProductService from "../product";
import * as Type from "./type";

const pathPrefix = "/file/repository";

class RepositoryService extends ProductService {
  /**
   * upload file to file repo
   * @param payload
   */
  upload = (payload: Type.UploadPayload): Promise<{ status: boolean }> =>
    // todo no mulitpart anymoe,  might need to fix
    super.request(pathPrefix + "/upload", payload);

  /**
   * serve file
   * @param filename filename
   */
  serve = (filename: string): Promise<Buffer> =>
    super.request(pathPrefix + "/serve/" + filename);

  write = (filename: string, data: string): Promise<{ status: boolean }> => {
    const payload = { name: filename, data };
    return super.request(pathPrefix + "/write", payload);
  };
}

export default RepositoryService;
