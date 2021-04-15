import QueryService from "./index";
import { HTTP } from "..";

// create dummy class from abstract class for test purposes
class MyQuery extends QueryService {
  async request(_uri: string, _payload: any) {
    return null;
  }
}

const Query = new MyQuery("myhost", "myauth");

describe("not implemented error", () => {
  test("method using request", async () => {
    await expect(Query.insert("Test", {})).rejects.toThrow(HTTP.Error);
  });
});
