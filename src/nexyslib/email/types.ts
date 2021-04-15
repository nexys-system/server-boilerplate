export interface Attachment {
  type: string;
  name: string;
  content: string; // base 64
}
/* attachment example
see https://mandrillapp.com/api/docs/messages.nodejs.html
[
  {
    type: "text/plain",
    name: "myfile.txt",
    content: "ZXhhbXBsZSBmaWxl",
  },
],
*/

export interface Recipients {
  recipients: string[];
}

export interface EmailPayload extends Recipients {
  title: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

export interface CMSPayload extends Recipients {
  key?: string;
  uuid?: string;
}
