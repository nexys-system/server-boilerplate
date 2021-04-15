import jwt from "jsonwebtoken";
import * as crypto from "crypto";

class JWTService {
  secretOrPrivateKey: string;
  secretOrPublicKey: string;
  algorithm: string;

  constructor(
    secretOrKeyPair:
      | crypto.KeyPairKeyObjectResult
      | { publicKey: string; privateKey: string }
      | string,
    algorithm: string | undefined = undefined
  ) {
    // NOTE: supported algorithms - https://github.com/auth0/node-jsonwebtoken#algorithms-supported

    if (typeof secretOrKeyPair === "object") {
      const { publicKey, privateKey } = secretOrKeyPair;

      this.secretOrPrivateKey = privateKey as string; // NOTE: PEM encoded private key for RSA and ECDSA
      this.secretOrPublicKey = publicKey as string; // NOTE: PEM encoded public key for RSA and ECDSA

      this.algorithm = algorithm || "RS256";
    } else {
      // NOTE: secret for HMAC algorithms
      this.secretOrPrivateKey = secretOrKeyPair;
      this.secretOrPublicKey = secretOrKeyPair;

      this.algorithm = algorithm || "HS256";
    }
  }

  /**
   * Returns the JsonWebToken as string
   * @param payload could be an object literal, buffer or string representing valid JSON.
   * @param options see here: https://github.com/auth0/node-jsonwebtoken/tree/88cb9df18a1d2a7b24f8cfeaa6f5f5b87d2c027f#jwtsignpayload-secretorprivatekey-options-callback
   */
  sign(payload: any, options: any = {}) {
    if (!options.algorithm) {
      options.algorithm = this.algorithm;
    }

    // console.log(options.algorithm);
    // NOTE: secretOrPrivateKey is a string, buffer, or object containing either the or the
    return jwt.sign(payload, this.secretOrPrivateKey, options);
  }

  /**
   * Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid.
   * If not, it will throw the error.
   * @param token is the JsonWebToken string
   * @param options see here: https://github.com/auth0/node-jsonwebtoken/tree/88cb9df18a1d2a7b24f8cfeaa6f5f5b87d2c027f#jwtverifytoken-secretorpublickey-options-callback
   *  - audience: if you want to check audience (aud), provide a value here. The audience can be checked against a string, a regular expression or a list of strings and/or regular expressions.
   *  - issuer (optional): string or array of strings of valid values for the iss field.
   */
  verify(token: string, options: any = {}) {
    if (!options.algorithms) {
      options.algorithms = [this.algorithm];
    }

    // NOTE: secretOrPublicKey is a string or buffer containing either the secret for HMAC algorithms, or the
    return jwt.verify(token, this.secretOrPublicKey, options);
  }

  /**
   * Returns the decoded payload without verifying if the signature is valid.
   * Warning: You should not use this for untrusted messages. You most likely want to use jwt.verify instead.
   * @param token
   * @param options
   *  - json: force JSON.parse on the payload even if the header doesn't contain "typ":"JWT".
   *  - complete: return an object with the decoded payload and header.
   */
  decode(token: string, options = {}) {
    return jwt.decode(token, options);
  }
}

export default JWTService;
