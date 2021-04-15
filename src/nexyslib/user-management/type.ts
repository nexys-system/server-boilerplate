import { UOptionSet, Uuid } from "@nexys/utils/dist/types";
import * as TC from "./crud-type";

export enum Status {
  active = 1,
  inactive = 3,
  pending = 2,
}

export type Profile = Pick<
  TC.User,
  "uuid" | "firstName" | "lastName" | "email" | "lang"
> & { instance: UOptionSet };

export interface UserCache {
  permissions: string[];
}

export interface LoginResponse {
  profile: Profile;
  cacheData: UserCache;
}

export type Action = "SET_ACTIVE" | "RESET_PASSWORD" | "CHANGE_EMAIL";

export interface ActionPayload {
  uuid: Uuid;
  instance: { uuid: Uuid };
  action: Action;
  issued: number;
  expires: number;
}
