export const updateParams = (item:any, n:number, filteredList:any[], idLabel:string = 'uuid', appendOriginal:boolean = true) => {
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