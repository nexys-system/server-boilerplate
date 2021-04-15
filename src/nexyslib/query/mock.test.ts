import * as T from './types';
import * as M from './mock';

describe('query mocking', () => {
  test('list', async () => {
    const data = [{a: 's'}, {b: 'b'}];
    expect(await M.list('myentity', {}, data)).toEqual(data)
  })

  test('find', async () => {
    const data = {a: 's'};
    expect(await M.find('myentity', {}, data)).toEqual(data)
  })

  test('detail', async () => {
    const data = {a: 's'};
    expect(await M.detail('myentity', 3, data)).toEqual(data)
  })

  test('insert', async () => {
    const data = {a: 's'};
    const r = await M.insert('myentity', data);
    expect(typeof r.id).toEqual('number')
  })

  test('insert multiple', async () => {
    const data = [{a: 's'}, {b: 'b'}];
    const r = await M.insertMultiple('myentity', data);
    expect(typeof r[0].id).toEqual('number')
    expect(typeof r[1].id).toEqual('number')
  })
})
