export const updateParams = (item:any, n:number, filteredList:any[], idLabel:string = 'uuid', appendOriginal:boolean = true):any[][] => {
  const unitDelta = -Math.sign(n);

  const r = filteredList.map(x => {
    const position = x.position + unitDelta;
    const id = x[idLabel];
    return [{position}, {[idLabel]: id}];
  });

  if (appendOriginal) {
    const newItem = [{position: item.position + n}, {[idLabel]: item[idLabel]}];
    r.unshift(newItem);
  }

  return r
} 

test('updateParams', () => {
  const item = {uuid: '2345', position: 3};
  const n = 34;
  const filteredList:any[] = []
  const r = updateParams(item, n, filteredList);
  const e = [[{position: 37}, {uuid: '2345'}]];
  expect(r).toEqual(e);
})