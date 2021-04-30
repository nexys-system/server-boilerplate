import * as L from '@nexys/lib';
import Model from '../../../common/generated/schema';
import { Constraint, Profile } from './type';
import * as Exclude from './exclude';

const defaultAppend = ({ uuid, instance }: Profile) => ({
  instance,
  user: { uuid },
  logUser: { uuid },
  logDateAdded: new Date()
});

export const getSuperadmin = () => {
  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map(),
    projectionConstraintsMap: new Map(
      Model.map(entity => {
        return [entity.name, entity.fields.map(x => ({ attribute: x.name }))];
      })
    )
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append: {} //defaultAppend(user, instance)
  };
  return { data, mutate };
};

// filter on instance and linked entities
export const getAdmin = (profile: Profile): Constraint => {
  const excludedEntities = [
    { name: 'Instance', filterAttribute: profile.instance }
  ];
  const append = defaultAppend(profile);

  return Exclude.queryConstraints(Model, excludedEntities, append);
};

// todo here user
// todo2: generate these when logging in, upon refresh token get the newest set
export const getApp = (profile: Profile): Constraint => {
  const excludedEntities = [
    { name: 'Instance', filterAttribute: profile.instance },
    { name: 'User', filterAttribute: { uuid: profile.uuid } }
  ];

  const append = defaultAppend(profile);

  return Exclude.queryConstraints(Model, excludedEntities, append);
};
