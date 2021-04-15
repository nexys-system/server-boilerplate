import * as Type from '../types';

export const detailByPosition = (position:number, entity:string):Type.Query => {
  return {[entity]: {filters: {position}}};
}

export const highestPosition = (entity:string):Type.Query => {
  return {[entity]: {
    order: {by: 'position', desc: true},
    take: 1
  }};
}

export const listFiltered = (position:number, n:number):Type.Filters => {
  if (n < 0) {
    return {position: {'$gt': position + n - 1, '$lt': position}};
  }

  return {position: {'$gt': position, '$lt': position + n + 1}};
}