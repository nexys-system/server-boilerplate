import * as L from '@nexys/lib';
import { Uuid } from '@nexys/utils/dist/types';

interface Entity {
  name: string;
  fields: { name: string; type: string }[];
}

const projections = (
  model: Entity[],
  entities: string[]
): [string, L.Query.Type.ProjectionConstraint[]][] =>
  model
    .filter(x => !entities.includes(x.name))
    .map(entity => {
      return [
        entity.name,
        entity.fields
          .filter(x => !entities.includes(x.type))
          .map(x => ({ attribute: x.name }))
      ];
    });

const filters = (
  model: Entity[],
  excludedEntities: { name: string; filterAttribute: { uuid: Uuid } }[]
): [string, L.Query.Type.FilterConstraint[]][] => {
  const filterConstraints: [
    string,
    L.Query.Type.FilterConstraint[]
  ][] = excludedEntities.map(excludedEntity => {
    return [
      excludedEntity.name,
      [{ attribute: 'uuid', filterAttribute: excludedEntity.filterAttribute }]
    ];
  });

  model.forEach(entity => {
    const { fields } = entity;

    excludedEntities.forEach(excludedEntity => {
      const f = fields.find(x => x.type === excludedEntity.name);

      if (f) {
        filterConstraints.push([
          entity.name,
          [
            {
              attribute: f.name,
              filterAttribute: excludedEntity.filterAttribute
            }
          ]
        ]);
      }
    });
  });

  return filterConstraints;
};

export const queryConstraints = (
  model: Entity[],
  excludedEntities: { name: string; filterAttribute: { uuid: Uuid } }[],
  append: Object
): {
  data: L.Query.Type.QueryConstraint;
  mutate: L.Query.Type.MutateConstraint;
} => {
  const projectionConstraints: [
    string,
    L.Query.Type.ProjectionConstraint[]
  ][] = projections(
    model,
    excludedEntities.map(x => x.name)
  );

  const filterConstraints = filters(model, excludedEntities);

  const data: L.Query.Type.QueryConstraint = {
    filterConstraintsMap: new Map(filterConstraints),
    projectionConstraintsMap: new Map(projectionConstraints)
  };

  const mutate: L.Query.Type.MutateConstraint = {
    filterConstraintsMap: new Map(),
    dataConstraintsMap: new Map(),
    append
  };
  return { data, mutate };
};
