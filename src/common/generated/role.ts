export enum Role {
  superadmin,
  admin,
  app
}

export const roles: string[] = Object.keys(Role).filter(x => isNaN(Number(x)));
