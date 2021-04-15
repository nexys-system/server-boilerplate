import nock from "nock";

import I18nService from "./index";
import { promises as fsp } from "fs";
import { languages as langMock } from "./mockdata";

const host = "http://flow.nexys.io";

const I18n = new I18nService(host, "token");

test("get languages", async () => {
  nock(host).get("/i18n/languages").reply(200, langMock);

  const result = await I18n.getLanguages();
  expect(result).toEqual(langMock);
});

test("get", async () => {
  nock(host).get("/i18n/languages").reply(200, langMock);
  const messages = { test: "asdf", hello: "world" };
  nock(host).get("/i18n/export/2").reply(200, messages);

  const result = await I18n.get("fr");
  expect(result).toEqual(messages);
});

test("save all", async () => {
  // here keep only the two first entries (ids 1 and 2), so only two exports need to be mocked
  const langs = langMock.slice(0, 2);
  nock(host).get("/i18n/languages").reply(200, langs);
  const messages = { test: "asdf", hello: "world" };
  nock(host).get("/i18n/export/1").reply(200, messages);

  nock(host).get("/i18n/export/2").reply(200, messages);

  await I18n.saveAll();

  const files = await fsp.readdir("./locales");
  expect(files).toEqual(["en.json", "fr.json"]);
  // https://nodejs.org/api/fs.html#fs_fs_rmdir_path_options_callback
  // Stability: 1 - Recursive removal is experimental.
  //await fsp.rmdir('./locales', { recursive: true });
});
