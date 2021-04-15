import crypto from "crypto";
import jwt from "jsonwebtoken";

import JWTService from "./index";

const payload: any = {
  instance: 1,
  product: 2,
  env: 3,
  iss: "nexys.io",
};

const secret: string = crypto.randomBytes(256).toString("base64");
const secretService = new JWTService(secret);
describe("test secret", () => {
  let token: any = null;
  test("sign", () => {
    token = secretService.sign(payload);
  });

  test("decode", () => {
    const result: any = secretService.decode(token);
    delete result.iat;
    expect(result).toEqual(payload);
  });

  test("verify", () => {
    const result: any = secretService.verify(token);
    delete result.iat;
    expect(result).toEqual(payload);
  });
});

const options = {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
};

const keyPair = crypto.generateKeyPairSync("rsa", options);
const keyService = new JWTService(keyPair);
describe("test key pair", () => {
  let token: any = null;
  test("sign", () => {
    token = keyService.sign(payload);
  });

  test("decode", () => {
    const result: any = keyService.decode(token);
    delete result.iat;
    expect(result).toEqual(payload);
  });

  test("verify", () => {
    const result: any = keyService.verify(token);
    delete result.iat;
    expect(result).toEqual(payload);
  });
});

describe("test audience", () => {
  let token: any = null;
  test("sign", () => {
    token = keyService.sign(payload);
  });

  let audienceToken: any;
  test("sign audience", () => {
    audienceToken = keyService.sign({ ...payload, aud: "flow.nexys.io" });
  });

  test("verify token", () => {
    // NOTE: JsonWebTokenError: jwt audience invalid. expected: flow.nexys.io
    expect(() => {
      keyService.verify(token, { audience: "flow.nexys.io" });
    }).toThrow(jwt.JsonWebTokenError);
  });

  test("verify audience token", () => {
    const result: any = keyService.verify(audienceToken, {
      audience: "flow.nexys.io",
    });
    delete result.iat;
    delete result.aud;
    expect(result).toEqual(payload);
  });
});
