import Request from './request';

const token:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YW5jZSI6IjJjNWQwNTM1LTI2YWItMTFlOS05Mjg0LWZhMTYzZTQxZjMzZCIsImluc3RhbmNlTmFtZSI6InRzc2FwcGxpY2F0aW9ucyIsInByb2R1Y3QiOjIsInByb2R1Y3ROYW1lIjoiQWNhZGVteSIsImVudiI6MiwiZW52TmFtZSI6InRlc3QiLCJzdWIiOiJBY2FkZW15X3Rlc3QiLCJpc3MiOiJob3N0IiwiYXVkIjoiZGV2aWNlVHlwZSIsImlhdCI6MTU2MDI1MTcxODk0NH0.ZqPvQejaLkeCgEHN3yCl7zgld4vASHbj4nXT6NExTmU';
const host = 'http://localhost:3333';

const R = new Request(host, token);
const uuid = '22d4b34e-5d4b-11ea-90f0-42010aac0009';
test('request', async () => {
  const d = {data:{text:'test2'}, headers: undefined, params: undefined}
  const r = await R.exec(uuid, d);

  expect(r).toEqual({message:'ok'})
})