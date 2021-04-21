// This code was generated automatically via the Nexys platform on Wed Apr 21 2021 23:29:09 GMT+0200 (Central European Summer Time), do not alter, regenerate if needed
//import { Uuid } from '@nexys/utils/dist/types';
import * as L from '@nexys/lib';
export enum Role {
  app,
  admin,
  superadmin
}

export const roles: string[] = Object.keys(Role).filter(x => isNaN(Number(x)));
export const roleKeys: number[] = Object.keys(Role)
  .map(x => Number(x))
  .filter(x => !isNaN(x));

export const constraintsProjection: Map<
  Role,
  [string, L.Query.Type.ProjectionConstraint[]][]
> = new Map([]);
