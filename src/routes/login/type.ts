import { Uuid } from '@nexys/utils/dist/types';

export interface Profile {
  firstName: string;
  lastName: string;
  id: Uuid;
  uuid: Uuid;
}

export interface UserCache {
  permissions: string[];
}

export interface Signup {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
