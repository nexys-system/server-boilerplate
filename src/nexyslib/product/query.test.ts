import nock from "nock";
import QueryService from "./query";

import HTTP from "@nexys/http";
import * as Type from "../query/types";

const Query = new QueryService("https://flow.digis.io", "token");

describe("test insert", () => {
  test("with nock - mutate insert - status response", async () => {
    nock("https://flow.digis.io")
      .post("/query/mutate")
      .reply(200, { status: true });

    await expect(Query.insert("Test", { test: "asdf" })).rejects.toThrow(
      HTTP.Error
    );
  });

  test("with nock - mutate insert - full response", async () => {
    const response: Type.MutateResponse = {
      Test: {
        insert: {
          success: true,
          uuid: "test",
        },
      },
    };

    nock("https://flow.digis.io").post("/query/mutate").reply(200, response);

    const result: { uuid: string } = (await Query.insert("Test", {
      test: "asdf",
    })) as { uuid: string };

    expect(result.uuid).toEqual("test");
  });

  /*test('with request mock', async () => {
    //MockedQuery.request.mockReturnValueOnce(new Promise(r => r({ status: true })));
    const response:Type.MutateResponse = {
      Test: {
        insert: {
          success: true,
          uuid: 'myuuid'
        }
      }
    }
  
    nock('https://flow.digis.io')
      .post('/query/mutate')
      .reply(200, response);

    await expect(Query.insert('Test', { test: 'asdf' })).rejects.toThrow(HTTP.Error);
  });*/
});
