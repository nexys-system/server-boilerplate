export enum Status {
  ok = 1,
  pending = 2,
  inactive = 3
}

const statusMap = new Map([
  [Status.ok, 'ok'],
  [Status.pending, 'pending'],
  [Status.inactive, 'inactive']
]);

export const statusToLabel = (s: Status) => {
  const st = statusMap.get(s);
  if (!st) {
    throw Error('could not find status');
  }

  return st;
};
