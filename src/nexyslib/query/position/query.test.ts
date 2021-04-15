import * as Query from './query';

test('highestPositionQuery', () => {
  const entity = 'myEntity';
  const e = {
    myEntity: {
      order: {
        by: 'position',
        desc: true,
      },
      take: 1,
    },
  }

  expect(Query.highestPosition(entity)).toEqual(e);
});


test('listFilteredQuery', () => {
  const position1 = 34;
  const n1 = 3;
  expect(Query.listFiltered(position1, n1)).toEqual({position: {"$gt": 34, "$lt": 38}});

  const position2 = 3;
  const n2 = -2;
  expect(Query.listFiltered(position2, n2)).toEqual({position: {"$gt": 0, "$lt": 3}});
});