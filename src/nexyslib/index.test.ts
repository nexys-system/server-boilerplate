import { Request, File, I18n, Product, Workflow, Email, JWT } from ".";
import Init from "./index";
import * as I from "./index";

test("export functions", () => {
  const modules = [File, I18n, Product, Workflow, Email, JWT];

  modules.forEach((m) => {
    expect(typeof m).toEqual("function");
  });
});

test("export http", () => {
  expect(typeof I.HTTP).toEqual("object");
});

test("export request", () => {
  expect(typeof Request).toEqual("object");
});

test("export query", () => {
  expect(typeof I.Query).toEqual("object");
});

test("export i18n utils", () => {
  expect(typeof I.I18nUtils).toEqual("object");
});

test("export types", () => {
  expect(typeof I.Types).toEqual("object");
});

test("export cms", () => {
  expect(typeof I.CMS).toEqual("function");
  expect(typeof I.CMSUtil).toEqual("object");
});

test("export cms", () => {
  expect(typeof I.Notification).toEqual("function");
  expect(typeof I.NotificationUtil).toEqual("object");
});

test("reallife example", async () => {
  const host = "https://flow-dev.nexys.io";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YW5jZSI6IjM3M2FiN2Q0LTU3YTctMTFlOS04MzFmLTQyMDEwYTg0MDA4MCIsImluc3RhbmNlTmFtZSI6Ik5leHlzIiwicHJvZHVjdCI6MTM0LCJwcm9kdWN0TmFtZSI6IkltdmVzdGVycyIsImVudiI6MSwiZW52TmFtZSI6ImRldiIsImlhdCI6MTYxNDI0Mzg5NH0.BkzAhAP-dpwFzUrPvfjTusYnBK3k2oWV7_dz9nnYl5Q";

  const init = Init({ host, authToken: token });

  const r = await init.ProductQuery.data({ User: {} });
  console.log(r);
});
