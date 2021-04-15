import HTTP from '@nexys/http';
import {
  Filters,
  Mutate,
  MutateParams,
  Query,
  Params,
  FilterConstraint,
  ProjectionConstraint,
  DataConstraint
} from './types';
import NUtils from '@nexys/utils';

export const paramsFromFilters = (
  filters: number | string | Filters
): Filters => {
  // typeof filters === Fitlers doesnt work
  if (typeof filters !== 'string' && typeof filters !== 'number') {
    return filters;
  }

  switch (typeof filters) {
    case 'string':
      return { uuid: filters };
    default: {
      return { id: filters };
    }
  }
};

export const deleteById = (
  entity: string,
  id: number | string | Filters
): Mutate => {
  const filters = paramsFromFilters(id);

  return {
    [entity]: {
      delete: {
        filters
      }
    }
  };
};

export const update = <A>(
  entity: string,
  id: number | string | Filters,
  data: Partial<A>
): Mutate<A> => {
  const filters = paramsFromFilters(id);
  return {
    [entity]: {
      update: {
        filters,
        data
      }
    }
  };
};

export const insert = <A = any>(
  entity: string,
  data: Omit<A, 'id' | 'uuid'> | Omit<A, 'id' | 'uuid'>[]
): Mutate<A> => {
  return {
    [entity]: {
      insert: {
        data
      }
    }
  };
};

export const getList = <A = any>(
  data: { [entity: string]: A[] },
  entity: string
): A[] => {
  if (data && data.hasOwnProperty(entity)) {
    return data[entity];
  }

  throw new HTTP.Error(
    `The requested resource \`${entity}\` does not exist`,
    400
  );
};

export const getFirst = <A = any>(
  data: A[],
  entity: string,
  optional: boolean = false
): A | null => {
  if (data && data.length > 0) {
    return data[0];
  }

  if (optional) {
    return null;
  }

  throw new HTTP.Error(
    `The requested entry of \`${entity}\` could not be found`,
    500
  );
};

export const getDetail = <A>(
  data: { [entity: string]: A[] },
  entity: string,
  optional: boolean = false
): A | null => {
  const r: A[] = getList(data, entity);
  return getFirst(r, entity, optional);
};

/**
 * takes any client query and adds constraints so that the user only sees what he/she's allowed to see
 * @param query client query
 * @param entityFilterConstraintsMap : map with filters constraints for all entities
 * @param entityProjectionConstraintsMap : map with projection constraints for all entities
 */
export const constructQueryPermission = (
  query: Query,
  entityFilterConstraintsMap: Map<string, FilterConstraint[]>,
  entityProjectionConstraintsMap: Map<string, ProjectionConstraint[]>,
  entitiesAllowed: string[] = [],
  entitiesNotAllowed: string[] = []
): Params[] => {
  // go through all entities
  return Object.keys(query).map(entity => {
    const q: Params = query[entity];

    if (entitiesAllowed.length > 0) {
      if (!entitiesAllowed.includes(entity)) {
        throw 'entity is not allowed - is not present in list of allowed entities';
      }
    } else {
      if (
        entitiesNotAllowed.length > 0 &&
        entitiesNotAllowed.includes(entity)
      ) {
        throw 'entity is not allowed - is present in list of not allowed entities';
      }
    }

    // get filter constraints
    const entityFilterConstraints: FilterConstraint[] =
      entityFilterConstraintsMap.get(entity) || [];
    // get projection constraints
    const entityProjectionConstraints: ProjectionConstraint[] =
      entityProjectionConstraintsMap.get(entity) || [];

    return constructParamsPermission(
      q,
      entityFilterConstraints,
      entityProjectionConstraints
    );
  });
};

/**
 * same as above but at the entity level
 * @param entity : entity of interest
 * @param params: params associated with entity
 * @param filterConstraints
 * @param projectionConstraints
 */
export const constructParamsPermission = (
  params: Params,
  filterConstraints: FilterConstraint[],
  projectionConstraints: ProjectionConstraint[]
): Params => {
  if (!params.filters || params.filters === undefined) {
    params.filters = {};
  }

  filterConstraints.map(filterConstraint => {
    // TS bug ? - see above
    if (!params.filters) {
      params.filters = {};
    }

    params.filters[filterConstraint.attribute] =
      filterConstraint.filterAttribute;
  });

  projectionConstraints.map(projectionConstraint => {
    // TS bug ? - see above
    if (!params.projection) {
      params.projection = {};
    }

    delete params.projection[projectionConstraint.attribute];
  });

  return params;
};

export const constructMutatePermission = (
  query: Mutate,
  entityFilterConstraintsMap: Map<string, FilterConstraint[]>,
  entityDataConstraintsMap: Map<string, DataConstraint[]>,
  insertAppend: Object = {},
  _entitiesAllowed: string[] = [],
  _entitiesNotAllowed: string[] = []
): Mutate => {
  Object.keys(query).forEach(entity => {
    const q = query[entity];

    // get filter constraints
    const entityFilterConstraints: FilterConstraint[] =
      entityFilterConstraintsMap.get(entity) || [];

    const entityDataConstraints: DataConstraint[] =
      entityDataConstraintsMap.get(entity) || [];

    constructMutatePermissionUnit(
      q,
      entityFilterConstraints,
      entityDataConstraints,
      insertAppend
    );
  });

  return query;
};

export const constructMutatePermissionUnit = (
  params: MutateParams,
  filterConstraints: FilterConstraint[],
  dataConstraints: DataConstraint[],
  insertAppend: any = {}
): MutateParams => {
  if (params.insert) {
    params.insert.data = { ...params.insert.data, ...insertAppend };
  }
  dataConstraints.map(dataConstraint => {
    if (params.insert) {
      if (Array.isArray(params.insert.data)) {
        params.insert.data.map(d => {
          d[dataConstraint.attribute] =
            dataConstraint.dataAttribute === '__random'
              ? NUtils.random.generateString(12)
              : dataConstraint.dataAttribute;
        });
      } else {
        params.insert.data[dataConstraint.attribute] =
          dataConstraint.dataAttribute === '__random'
            ? NUtils.random.generateString(12)
            : dataConstraint.dataAttribute;
      }
    }
  });

  filterConstraints.map(filterConstraint => {
    if (params.update) {
      if (!params.update.filters) {
        params.update.filters = {};
      }

      params.update.filters[filterConstraint.attribute] =
        filterConstraint.filterAttribute;
    }

    if (params.delete) {
      if (!params.delete.filters) {
        params.delete.filters = {};
      }

      params.delete.filters[filterConstraint.attribute] =
        filterConstraint.filterAttribute;
    }
  });

  return params;
};
