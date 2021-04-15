import ProductService from "../product";
import { Uuid } from "@nexys/utils/dist/types";

export interface Out {
  title?: string;
  content: string;
  isHtml: boolean;
}

export interface Cms {
  uuid: Uuid;
  lang: string;
  isHtml: boolean;
}

class CMSService extends ProductService {
  async get(uuid: Uuid, lang: string = "en"): Promise<Out> {
    if (lang.length !== 2) {
      throw Error("lang must be an iso1 code (2 characters)");
    }

    return this.request("/cms", { uuid, lang });
  }
}

export default CMSService;
