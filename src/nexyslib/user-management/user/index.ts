import { Uuid } from '@nexys/utils/dist/types';
import QueryService from '../../query/service';
import * as U from '../utils';
import * as T from '../type';
import * as CT from '../crud-type';
import { UOptionSet } from '@nexys/utils/dist/types';
import PermissionService from '../permission';
import * as Status from './status';

export default class User {
  qs: QueryService;
  permissionService: PermissionService;
  constructor(qs: QueryService) {
    this.qs = qs;
    this.permissionService = new PermissionService(qs);
  }

  getByEmail = async (
    email: string,
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: { id: T.Status };
    UserAuthentication?: CT.UserAuthentication[];
  }> => {
    // get user with associated authentication methods
    const {
      uuid,
      firstName,
      lastName,
      lang,
      status,
      instance,
      UserAuthentication
    }: {
      uuid: Uuid;
      firstName: string;
      lastName: string;
      lang: string;
      status: { id: T.Status };
      instance: UOptionSet;
      UserAuthentication?: CT.UserAuthentication[];
    } = await this.qs.find(U.Entity.User, {
      projection: {
        uuid: true,
        firstName: true,
        lastName: true,
        lang: true,
        status: true,
        instance: { uuid: true, name: true }
      },
      filters: { email, instance: { uuid: instanceIn?.uuid || '' } },
      references: { [U.Entity.UserAuthentication]: {} }
    });

    const profile = { uuid, firstName, lastName, email, lang, instance };

    return { profile, status, UserAuthentication };
  };

  getUserByEmailWithPassword = async (
    email: string,
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: { id: T.Status };
    hashedPassword: string;
    auth: { uuid: Uuid };
  }> => {
    try {
      const { profile, status, UserAuthentication } = await this.getByEmail(
        email,
        instanceIn
      );

      const userAuthentication = UserAuthentication?.find(
        x => x.type.id === U.userAuthenticationPasswordId
      );

      if (!userAuthentication) {
        throw new Error(`account does not exist`);
      }

      const hashedPassword = userAuthentication.value;

      return {
        profile,
        status,
        hashedPassword,
        auth: { uuid: userAuthentication.uuid }
      };
    } catch (err) {
      throw Error('no user could be found with email: ' + email);
    }
  };

  changeStatus = async (
    uuid: Uuid,
    instance: { uuid: Uuid },
    status: T.Status = T.Status.active
  ): Promise<boolean> => {
    const r = await this.qs.update(
      U.Entity.User,
      { uuid, instance },
      { status }
    );
    return r.success;
  };

  changeEmail = async (
    uuid: Uuid,
    instance: { uuid: Uuid },
    email: string
  ): Promise<boolean> => {
    const r = await this.qs.update(
      U.Entity.User,
      { uuid, instance },
      { email }
    );
    return r.success;
  };

  insertByProfile = async (
    profile: Omit<T.Profile, 'uuid'>,
    statusId: T.Status = T.Status.pending
  ): Promise<{ uuid: Uuid }> => {
    const row: Omit<CT.User, 'uuid'> = {
      ...profile,
      status: { id: statusId },
      logDateAdded: new Date()
    };

    const r = await this.qs.insertUuid(U.Entity.User, row);
    return { uuid: r.uuid };
  };

  insertAuth = async (
    uuid: Uuid,
    value: string,
    typeId: number = U.userAuthenticationPasswordId
  ): Promise<{ uuid: string }> => {
    const row: Omit<CT.UserAuthentication, 'uuid'> = {
      type: { id: typeId },
      user: { uuid },
      isEnabled: true,
      value
    };

    const r = await this.qs.insertUuid(U.Entity.UserAuthentication, row);

    return { uuid: r.uuid };
  };

  // admin functionalities

  list = async (instance: { uuid: Uuid }): Promise<CT.User[]> => {
    const r = await this.qs.list<CT.User>(U.Entity.User, {
      filters: { instance }
    });

    return r.map(x => {
      return {
        ...x,
        status: { id: x.status.id, name: Status.statusToLabel(x.status.id) }
      };
    });
  };

  detail = async (uuid: Uuid, instance: { uuid: Uuid }): Promise<CT.User> => {
    const r = await this.qs.detail<CT.User>(U.Entity.User, uuid);

    if (!r || r.instance.uuid !== instance.uuid) {
      throw Error('user could not be found');
    }

    return r;
  };

  insert = async (row: Omit<CT.User, 'uuid'>): Promise<string> => {
    const r = await this.qs.insertUuid(U.Entity.User, row);

    return r.uuid;
  };

  update = async (uuid: Uuid, row: Partial<CT.User>): Promise<boolean> => {
    const r = await this.qs.update(U.Entity.User, { uuid }, row);

    return r.success;
  };

  delete = async (uuid: Uuid): Promise<boolean> => {
    const r = await this.qs.delete(U.Entity.User, { uuid });

    return r.success;
  };
}
