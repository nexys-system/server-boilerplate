import I from "./index";
import * as M from "../mock";
import { decryptPayload } from "../action-payload";

const secret = "durbdhrbserjvcejg37fg3hcishfjkic";
const PasswordService = new I(M.qs, secret);

describe("passwor service", () => {
  test("generate token", async () => {
    const encrypted = await PasswordService.forgotPassword("john@doe.com");
    const decrypted = decryptPayload(encrypted, secret);

    const dt = new Date().getTime();

    expect(decrypted.uuid).toEqual("myUuid");
    expect(decrypted.instance).toEqual({ uuid: "instanceUuid" });
    expect(decrypted.issued).toBeLessThanOrEqual(dt);
    expect(decrypted.expires).toBeGreaterThan(dt);
  });
});
