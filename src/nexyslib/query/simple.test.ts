import nock from "nock";
import QueryService from "./simple";

import HTTP from "@nexys/http";
import * as Type from "./types";

const Query = new QueryService("https://query.digis.io", "token");

describe("insert", () => {
  test("success true - nock", async () => {
    const response: Type.MutateResponse = {
      Test: {
        insert: {
          success: true,
          uuid: "test",
        },
      },
    };

    nock("https://query.digis.io").post("/mutate").reply(200, response);

    const result = (await Query.insert("Test", { test: "asdf" })) as {
      uuid: string;
    };
    expect(result.uuid).toBe("test");
  });

  test("success false - nock", async () => {
    const response: Type.MutateResponse = {
      Test: {
        insert: {
          success: false,
          status:
            "List((List(test),CrudFieldRequiredError(this field is required)))",
        },
      },
    };

    nock("https://query.digis.io").post("/mutate").reply(200, response);

    await expect(Query.insert("Test", {})).rejects.toThrow(HTTP.Error);
  });

  test("faulty response - nock", async () => {
    nock("https://query.digis.io").post("/mutate").reply(200, {});

    await expect(Query.insert("Test", { test: "asdf" })).rejects.toThrow(
      HTTP.Error
    );
  });
});

describe("update", () => {
  test("with id - nock", async () => {
    const data = { test: "asdf" };

    const body: Type.Mutate = {
      Test: {
        update: {
          filters: { id: 1 },
          data,
        },
      },
    };

    const entity = "Test";
    const mutateResponse: Type.MutateResponse = {
      [entity]: { update: { success: true, updated: 2 } },
    };

    const scope = nock("https://query.digis.io")
      .post("/mutate", body as nock.DataMatcherMap)
      .reply(200, mutateResponse);

    const result = await Query.update(entity, 1, data);

    expect(scope.isDone()).toBe(true);
    expect(result.success).toBe(true);
    expect(result.updated).toBe(2);
  });

  test("with uuid - nock", async () => {
    const data = { test: "asdf" };

    const body: Type.Mutate = {
      Test: {
        update: {
          filters: { uuid: "testuuid" },
          data,
        },
      },
    };

    const entity = "Test";

    const mutateResponse: Type.MutateResponse = {
      [entity]: { update: { success: true, updated: 3 } },
    };

    const scope = nock("https://query.digis.io")
      .post("/mutate", body as nock.DataMatcherMap)
      .reply(200, mutateResponse);
    const result = await Query.update(entity, "testuuid", { test: "asdf" });
    expect(scope.isDone()).toBe(true);
    expect(result.success).toBe(true);
    expect(result.updated).toBe(3);
  });

  test("with filters - nock", async () => {
    const data = { test: "asdf" };

    const filters: Type.Filters = { testId: 3 };
    const body: Type.Mutate = {
      Test: {
        update: {
          filters,
          data,
        },
      },
    };

    const entity = "Test";
    const mutateResponse: Type.MutateResponse = {
      [entity]: { update: { success: true, updated: 4 } },
    };

    const scope = nock("https://query.digis.io")
      .post("/mutate", body as nock.DataMatcherMap)
      .reply(200, mutateResponse);
    const result = await Query.update(entity, filters, data);

    expect(scope.isDone()).toBe(true);
    expect(result.success).toBe(true);
    expect(result.updated).toBe(4);
  });
});

describe("list", () => {
  test("normal", async () => {
    const params = { filters: { tag: "me" } };
    const payload = { Test: params };

    const body = [
      { id: 1, test: "asdf", tag: "me" },
      { id: 3, hello: "world", tag: "me" },
    ];

    let observedBody = null;
    const scope = nock("https://query.digis.io")
      .post("/data", (body) => {
        observedBody = body;
        return observedBody;
      })
      .reply(200, {
        Test: body,
      });

    const result = await Query.list("Test", params);

    expect(scope.isDone()).toBe(true);
    expect(observedBody).toEqual(payload);

    expect(result).toEqual(body);
  });

  test("find", async () => {
    const params = { filters: { tag: "me" } };
    const payload = { Test: params };

    const body = [{ id: 1, test: "asdf", tag: "me" }];

    let observedBody = null;
    const scope = nock("https://query.digis.io")
      .post("/data", (body) => {
        observedBody = body;
        return observedBody;
      })
      .reply(200, {
        Test: body,
      });

    const result = await Query.find("Test", params);

    expect(scope.isDone()).toBe(true);
    expect(observedBody).toEqual(payload);

    expect(result).toEqual(body[0]);
  });

  test("error", async () => {
    nock("https://query.digis.io").post("/data").reply(200, { status: true });

    await expect(Query.list("Test", {})).rejects.toThrow(HTTP.Error);
  });
});

describe("detail", () => {
  test("id", async () => {
    const id = 2;
    const payload = { Test: { filters: { id } } };
    const body = [{ id: 2, hello: "world" }];

    let observedBody = null;
    const scope = nock("https://query.digis.io")
      .post("/data", (body) => {
        observedBody = body;
        return observedBody;
      })
      .reply(200, {
        Test: body,
      });

    const result = await Query.detail("Test", id);

    expect(scope.isDone()).toBe(true);
    expect(observedBody).toEqual(payload);

    expect(result).toEqual(body[0]);
  });

  test("uuid", async () => {
    const uuid = "test";
    const payload = {
      Test: { filters: { uuid } },
    };
    const body = [{ uuid: "test", hello: "world" }];

    let observedBody = null;
    const scope = nock("https://query.digis.io")
      .post("/data", (body) => {
        observedBody = body;
        return observedBody;
      })
      .reply(200, {
        Test: body,
      });

    const result = await Query.detail("Test", uuid);

    expect(scope.isDone()).toBe(true);
    expect(observedBody).toEqual(payload);

    expect(result).toEqual(body[0]);
  });

  test("error", async () => {
    nock("https://query.digis.io").post("/data").reply(200, { Test: null });

    await expect(Query.detail("Test", "werxw")).rejects.toThrow(HTTP.Error);
  });
});

// TODO: delete (if mutate used)

// TODO: multiple inserts / updates
