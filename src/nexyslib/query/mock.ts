import * as T from './types';

export const list = async <A>(
  _entity: string,
  _params: T.Params,
  mockData: A[]
): Promise<A[]> => {
  return Promise.resolve(mockData);
};

export const find = async <A>(
  _entity: string,
  _params: T.Params,
  mockData: A
): Promise<A> => {
  return Promise.resolve(mockData);
};

export const detail = async <A>(
  _entity: string,
  _id: number,
  mockData: A
): Promise<A> => {
  return Promise.resolve(mockData);
};

export const insert = async <A>(
  _entity: string,
  _data: A
): Promise<T.MutateResponseInsert> => {
  const id = Math.round(100 * Math.random());

  return Promise.resolve({ id, success: true });
};

export const insertMultiple = async <A = any>(
  _entity: string,
  data: A[]
): Promise<T.MutateResponseInsert[]> => {
  const ids = new Array(data.length).fill(Math.round(100 * Math.random()));

  return Promise.resolve(
    ids.map(id => {
      return { id, success: true };
    })
  );
};
