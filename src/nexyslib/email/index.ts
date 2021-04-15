import ProductService from "../product";

import Utils from "@nexys/utils";
import * as U from "./utils";
import { EmailPayload, CMSPayload, Attachment } from "./types";

class EmailService extends ProductService {
  active: boolean;
  constructor(host: string, authToken: string, active: boolean = true) {
    super(host, authToken);

    this.active = active;
  }

  async send(
    to: string | string[],
    title: string,
    text?: string,
    html?: string,
    attachments?: Attachment[]
  ) {
    const recipients = U.parseRecipients(to);

    const payload: EmailPayload = { title, text, html, recipients };

    if (attachments) {
      payload.attachments = attachments;
    }

    if (!this.active) {
      console.warn("The Email Service is not configured to send emails");
      return false;
    }

    return await this.request("/email", payload);
  }

  async findAndSend(
    uuidOrKey: string,
    to: string | string[],

    params?: { [key: string]: string }
  ) {
    const recipients = U.parseRecipients(to);

    const payload: CMSPayload = { recipients };

    if (Utils.string.isUUID(uuidOrKey)) {
      payload.uuid = uuidOrKey;
    } else {
      payload.key = uuidOrKey;
    }

    if (!this.active) {
      console.warn("The Email Service is not configured to send emails");
      // console.log(`Logging CMS uuid ${uuid} with params ${JSON.stringify(params)} the recipients are: ${JSON.stringify(recipients)}`);

      return false;
    }

    return await this.request("/email/cms", { ...payload, params });
  }
}

export default EmailService;
