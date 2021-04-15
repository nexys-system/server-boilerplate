import * as U from "./utils";

describe("parse recipients", () => {
  test("single", () => {
    const email = "info@nexys.ch";
    const recipient = U.parseRecipients(email);
    expect(recipient).toEqual([email]);
  });

  test("multiple", () => {
    const emails = ["info@nexys.ch", "systems@nexys.ch"];
    const recipients = U.parseRecipients(emails);
    expect(recipients).toEqual(emails);
  });

  test("multiple (string)", () => {
    const emails = ["info@nexys.ch", "systems@nexys.ch"];
    const recipients = U.parseRecipients(emails.join(", "));
    expect(recipients).toEqual(emails);
  });
});
