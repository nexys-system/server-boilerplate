import nock from "nock";

import * as EmailUtil from "./utils";

import EmailService from "./index";
test("df", () => {
  expect(true).toEqual(true);
});

const Email = new EmailService("https://flow.digis.io", "token", true);

test("host", () => {
  expect(Email.host).toEqual("https://flow.digis.io");
});

describe("parse recipients", () => {
  test("single", () => {
    const email = "info@nexys.ch";
    const payload = EmailUtil.parseRecipients(email);
    expect(payload).toEqual([email]);
  });

  test("multiple", () => {
    const emails = ["info@nexys.ch", "systems@nexys.ch"];
    const payload = EmailUtil.parseRecipients(emails);
    expect(payload).toEqual(emails);
  });

  test("multiple (string)", () => {
    const emails = ["info@nexys.ch", "systems@nexys.ch"];
    const payload = EmailUtil.parseRecipients(emails.join(", "));
    expect(payload).toEqual(emails);
  });
});

describe("email", () => {
  const recipients = ["systems@nexys.ch"];

  test("send", async () => {
    let observedBody = null;
    const scope = nock("https://flow.digis.io")
      .post("/email", (body: any) => {
        observedBody = body;
        return observedBody;
      })
      .reply(200, { status: true });

    const title = "title";
    const text = "text";

    await Email.send(recipients, title, text);

    expect(scope.isDone()).toBe(true);
    expect(observedBody).toEqual({ recipients, title, text });
  });

  test("find and send to multiple", async () => {
    let observedBody = null;
    const scope = nock("https://flow.digis.io")
      .post("/email/cms", (body) => {
        observedBody = body;
        return observedBody;
      })
      .reply(200, { status: true });

    const uuid = "2c4a1b2e-4b29-11e9-831f-42010a840080";
    await Email.findAndSend(uuid, recipients);

    expect(scope.isDone()).toBe(true);
    expect(observedBody).toEqual({ recipients, uuid });
  });

  test("find and send", async () => {
    let observedBody = null;
    const scope = nock("https://flow.digis.io")
      .post("/email/cms", (body) => {
        observedBody = body;
        return observedBody;
      })
      .reply(200, { status: true });

    const uuid = "2c4a1b2e-4b29-11e9-831f-42010a840080";
    await Email.findAndSend(uuid, recipients[0]);

    expect(scope.isDone()).toBe(true);
    expect(observedBody).toEqual({ recipients, uuid });
  });
});
