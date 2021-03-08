// file generated automatically from the Nexys platform and should not be edited manually. "2021-03-08T13:31:21.343Z"

export interface UserPermission {
  uuid: string;
  permissionInstance: { uuid: string } | PermissionInstance;
  user: { uuid: string } | User;
}

export interface UserAuthenticationType {
  id: number;
  name: string;
}

export interface UserStatus {
  id: number;
  name: string;
}

export interface UserAuthentication {
  uuid: string;
  value: string;
  isEnabled: boolean;
  type: { id: number } | UserAuthenticationType;
  user: { uuid: string } | User;
}

export interface PermissionInstance {
  uuid: string;
  instance: { uuid: string } | Instance;
  permission: { uuid: string } | Permission;
}

export interface Permission {
  uuid: string;
  name: string;
}

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  status: { id: number } | UserStatus;
  logDateAdded: Date;
  instance: { uuid: string } | Instance;
}

export interface Instance {
  uuid: string;
  name: string;
  dateAdded: Date;
}
