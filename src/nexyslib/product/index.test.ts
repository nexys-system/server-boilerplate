import nock from "nock";
import ProductService from "./index";
//jest.mock("./request-helper");

const Service = new ProductService("https://flow.digis.io", "token");

describe("request", () => {
  test("default", async () => {
    nock("https://flow.digis.io")
      .get("/")
      .matchHeader("app-token", /\w+/)
      .reply(200, { message: "version" });

    const result = await Service.request("/");
    expect(result.message).toBe("version");
  });

  test("ensure subscription", async () => {
    nock("https://flow.digis.io")
      .get("/app/get")
      .matchHeader("app-token", /\w+/)
      .reply(400, { message: "Not configured" });

    nock("https://flow.digis.io")
      .get("/app/subscribe")
      .matchHeader("app-token", /\w+/)
      .reply(200, { message: "Successfully subscribed" });

    const result = await Service.ensureSubscribed();
    expect(result.message).toEqual("Successfully subscribed");
  });
});

describe("test service endpoint", () => {
  test("with nock", async () => {
    nock("https://flow.digis.io")
      .post("/workflow/init")
      .reply(200, { workflow: "instance" });

    const result = await Service.request("/workflow/init", { uuid: "test" });
    expect(result).toEqual({
      workflow: "instance",
    });
  });

  test("with request mock", async () => {
    Service.request = jest.fn();
    const mockRequest = Service.request as jest.Mock;
    //Service.request.mockReturnValueOnce({ workflow: 'instance' });
    mockRequest.mockResolvedValueOnce({ workflow: "instance" });

    const result = await Service.request("/workflow/init", { uuid: "test" });
    expect(result).toEqual({
      workflow: "instance",
    });
  });
});

/*
test('refresh', async () => {
  const r = await refresh();
  const e = {message: "App configuration refreshed successfully for provided token"};
  expect(r).toEqual(e);
});*/
