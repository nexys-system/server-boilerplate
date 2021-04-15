import * as Utils from './utils';
import { withPosition } from '../types';

const list = [
  {uuid: 1, position: 1},
  {uuid: 2, position: 2},
  {uuid: 3, position: 3},
  {uuid: 4, position: 4},
  {uuid: 5, position: 5},
];

const filterList = (l:withPosition[], position:number, n:number):withPosition[] => {
  const f = (x:withPosition, position:number, n:number):boolean => {
    if( n < 0 ) {
      return x.position < position && x.position >= position + n
    }

    return x.position > position && x.position <= position + n;
  }

  return l.filter(x => f(x, position, n));
}

test('updateParams 1', () => {
  const item = {uuid: 2, position: 2};
  const n = 2;

  const e = [
    [{position: 4}, {uuid: 2}],
    [{position: 2}, {uuid: 3}],
    [{position: 3}, {uuid: 4}]
  ];

  const filteredList = filterList(list, item.position, n);
  const r = Utils.updateParams(item, n, filteredList);

  expect(r).toEqual(e);
});

test('updateParams 2', () => {
  const item = {uuid: 5, position: 5};
  const n = -4;

  const e = [
    [{position: 1}, {uuid: 5}],
    [{position: 2}, {uuid: 1}],
    [{position: 3}, {uuid: 2}],
    [{position: 4}, {uuid: 3}],
    [{position: 5}, {uuid: 4}]
  ];

  const filteredList = filterList(list, item.position, n);
  const r = Utils.updateParams(item, n, filteredList);

  expect(r).toEqual(e);
});
