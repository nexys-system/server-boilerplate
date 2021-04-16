import { Uuid } from '@nexys/utils/dist/types';
import QueryService from '../../query/service';
import * as U from './utils';
import * as UU from '../utils';
import * as CT from '../crud-type';
import UserService from '../user';
import * as A from '../action-payload';

export default class Password {
  qs: QueryService;
  userService: UserService;
  secretKey: string; // used for encypting and decruypting action messages
  constructor(qs: QueryService, secretKey: string) {
    this.qs = qs;
    this.secretKey = secretKey;
    this.userService = new UserService(qs);
  }

  /**
   * sets password for user
   * @param uuid user Uuid
   * @param password new password
   * @param instance instance linked with user
   * @param oldPassword : old password (optional)
   * @returns boolean
   */
  setPassword = async (
    uuid: Uuid,
    password: string,
    instance: { uuid: Uuid },
    oldPassword?: string
  ): Promise<{ success: boolean }> => {
    const userFilter = { uuid, instance };

    const userAuth: CT.UserAuthentication = await this.qs.find(
      UU.Entity.UserAuthentication,
      {
        filters: {
          user: userFilter,
          type: { id: UU.userAuthenticationPasswordId }
        }
      }
    );

    console.log(userAuth);
    if (oldPassword && !U.matchPassword(oldPassword, userAuth.value)) {
      throw Error('the old password is not correct');
    }

    const value = U.hashPassword(password);

    const r = await this.qs.update(
      UU.Entity.UserAuthentication,
      { uuid: userAuth.uuid, user: userFilter },
      { value }
    );

    return r;
  };

  /**
   *
   * @param email
   * @returns generate link with special key so that the user is allowed to reset his password
   */
  forgotPassword = async (email: string): Promise<string> => {
    const user = await this.userService.getUserByEmailWithPassword(email);

    return A.createActionPayload(
      user.profile.uuid,
      { uuid: user.profile.instance.uuid },
      'RESET_PASSWORD',
      this.secretKey
    );
  };

  resetPassword = async (
    password: string,
    encrypted: string
  ): Promise<{ success: boolean }> => {
    const { uuid, instance } = A.decryptPayload(encrypted, this.secretKey);

    return this.setPassword(uuid, password, instance);
  };

  requestEmailChange = async (
    uuid: Uuid,
    instance: { uuid: Uuid }
  ): Promise<string> => {
    return A.createActionPayload(
      uuid,
      instance,
      'CHANGE_EMAIL',
      this.secretKey
    );
  };

  changeEmail = async (email: string, encrypted: string): Promise<boolean> => {
    const { uuid, instance } = A.decryptPayload(encrypted, this.secretKey);

    return this.userService.changeEmail(uuid, instance, email);
  };
}
