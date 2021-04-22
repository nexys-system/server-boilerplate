import * as L from '@nexys/lib';
import Model from '../../../common/generated/schema';
import { Constraint, Profile } from './type';

const defaultAppend = ({ uuid, instance }: Profile) => ({
  instance,
  user: { uuid },
  logUser: { uuid },
  logDateAdded: new Date()
});

export const getSuperadmin = () => {
  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map(),
    projectionConstraintsMap: new Map()
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
  const c: [string, L.Query.Type.ProjectionConstraint[]][] = [
    ['Permission', [{ attribute: 'name' }]]
  ];
  const filterConstraints: [string, L.Query.Type.FilterConstraint[]][] = [
    [
      'Instance',
      [{ attribute: 'uuid', filterAttribute: profile.instance.uuid }]
    ]
  ];

  Model.forEach(entity => {
    const { fields } = entity;

    const f = fields.find(x => x.type === 'Instance');

    if (f) {
      filterConstraints.push([
        entity.name,
        [
          {
            attribute: 'instance',
            filterAttribute: profile.instance
          }
        ]
      ]);
    }
  });

  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map(filterConstraints),
    projectionConstraintsMap: new Map(c)
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append: defaultAppend(profile)
  };
  return { data, mutate };
};

// todo here user
// todo2: generate these when logging in, upon refresh token get the newest set
export const getApp = (profile: Profile): Constraint => {
  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map([
      [
        'Instance',
        [{ attribute: 'uuid', filterAttribute: profile.instance.uuid }]
      ]
    ]),
    projectionConstraintsMap: new Map()
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append: defaultAppend(profile)
  };
  return { data, mutate };
};
