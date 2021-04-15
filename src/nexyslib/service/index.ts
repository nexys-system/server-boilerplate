// https://www.tutorialsteacher.com/typescript/abstract-class
abstract class Service {
  host: string;
  auth: string;

  constructor(host: string, auth: string) {
    this.host = host;
    this.auth = auth;
  }

  abstract request(uri: string, payload: any, headers: any): Promise<any>;
}

export default Service;
