import { promises as fsp } from "fs";
import * as fs from "../file/utils";
import ProductService from "../product";

import { Language } from "./type";

class I18nService extends ProductService {
  local: boolean;
  path: string;
  constructor(
    host: string,
    auth: string,
    local: boolean = false,
    path: string = "./locales"
  ) {
    super(host, auth);

    this.local = local;
    this.path = path; // process.cwd()
  }

  /**
   * returns a promise of the list of languages
   */
  getLanguages(): Promise<Language[]> {
    return this.request("/i18n/languages");
  }

  getExport(id: string | number) {
    return this.request(`/i18n/export/${id}`);
  }

  async get(locale: string) {
    const languages: Language[] = await this.getLanguages();
    const language: Language | undefined = languages.find(
      ({ iso2 }) => iso2 === locale
    );

    if (language) {
      return await this.getExport((language as Language).id);
    }

    // todo: here in case of error
  }

  // TODO: serve?
  getFile(locale: string) {
    return fs.getContent(`${this.path}/${locale}.json`);
  }

  async saveToFile(locale: string, messages: string) {
    try {
      const json = JSON.stringify(messages);
      const path = `${this.path}/${locale}.json`;
      await fsp.writeFile(path, json, "utf8");
      console.log(`${path} saved`);
    } catch (err) {
      if (err) console.error(err);
    }
  }

  /**
   * saves all files locally at `this.path`
   */
  async saveAll(cache: boolean = false) {
    const exists = await fs.dirExists(this.path);
    if (exists) {
      const languages = await this.getLanguages();
      if (languages) {
        for (const { id, iso2 } of languages) {
          if (!cache) {
            const messages = await this.getExport(id);
            await this.saveToFile(iso2, messages);
          }
        }
      }
    }
  }

  async init() {
    if (this.local) {
      const exists = await fs.exists(`${this.path}/en.json`);
      if (!exists) {
        await this.saveAll();
      }

      return;
    }

    await this.saveAll();
  }
}

export default I18nService;
