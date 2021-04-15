import Request from "./request";
import Chain from "./chain";
import Snippet from "./snippet";

const Service = (host: string, auth: string) => ({
  Request: new Request(host, auth),
  Chain: new Chain(host, auth),
  Snippet: new Snippet(host, auth),
});

export { Request, Chain, Snippet, Service };

export default Service;
