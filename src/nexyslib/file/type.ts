export interface FileOptions {
  filename: string;
  size?: number;
}

// this is then mapped to same as import { File } from "formidable";
export interface FilePayload {
  value: Buffer;
  options: FileOptions;
}

export interface UploadPayload {
  file: FilePayload;
  name: string;
}
