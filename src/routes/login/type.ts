import { Uuid, UOptionSet } from '@nexys/utils/dist/types';

export interface Profile {
  firstName: string;
  lastName: string;
  id: Uuid;
  uuid: Uuid;
  //instance: UOptionSet;
}

export interface UserCache {
  permissions: string[];
}
