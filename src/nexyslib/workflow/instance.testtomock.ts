/*test('t', () => {
  expect(true).toEqual(true);
})*/


import WorkflowService from './index';
import * as T from './types';
import { string } from '@nexys/utils';

const token:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YW5jZSI6IjJjNWQwNTM1LTI2YWItMTFlOS05Mjg0LWZhMTYzZTQxZjMzZCIsImluc3RhbmNlTmFtZSI6InRzc2FwcGxpY2F0aW9ucyIsInByb2R1Y3QiOjIsInByb2R1Y3ROYW1lIjoiQWNhZGVteSIsImVudiI6MiwiZW52TmFtZSI6InRlc3QiLCJzdWIiOiJBY2FkZW15X3Rlc3QiLCJpc3MiOiJob3N0IiwiYXVkIjoiZGV2aWNlVHlwZSIsImlhdCI6MTU2MDI1MTcxODk0NH0.ZqPvQejaLkeCgEHN3yCl7zgld4vASHbj4nXT6NExTmU';
const host = 'http://localhost:3333';

const W = new WorkflowService(host, token);
const machineUuid = 'f386eed1-6209-11ea-90f0-42010aac0009';
const workflow:T.UOptionSet = {
  name: 'Test',
  uuid: machineUuid
}

const instanceUuid = '2c5d0535-26ab-11e9-9284-fa163e41f33d';

let uuid:any = null;

const transition1Uuid = 'b3a3cab4-7f66-11ea-90f0-42010aac0009';
const transition2Uuid = 'bee2531d-8171-11ea-90f0-42010aac0009';
const transition3Uuid = 'cfa6c7a3-8171-11ea-90f0-42010aac0009';
const transition4Uuid = 'd89b73c5-8171-11ea-90f0-42010aac0009';
const transition5Uuid = 'de5d3ac0-8171-11ea-90f0-42010aac0009';

const transitions:string[] = [
  transition1Uuid,
  transition2Uuid,
  transition3Uuid,
  transition4Uuid,
  transition5Uuid
];

const nodes = [
  'abbedaa9-7f66-11ea-90f0-42010aac0009',
  'a06b2f4b-8171-11ea-90f0-42010aac0009',
  'a5a91a3c-8171-11ea-90f0-42010aac0009',
  'afa159fb-8171-11ea-90f0-42010aac0009',
  'b2575ecb-8171-11ea-90f0-42010aac0009'
];

const mydata = {text: 'from workflow'};

test('init', async () => {
  const init = await W.init(machineUuid)
  expect(init.workflow).toEqual(workflow);
  expect(string.isUUID(init.uuid)).toEqual(true);
  console.log(init.uuid);
  uuid = init.uuid;
  
});

test('state', async () => {
  const state = await W.state(uuid);

  if(!state.transitions) {
    throw Error('no state transitions')
  }

  const transition = state.transitions[0];

  console.log(state)

  expect(transition.uuid).toEqual(transition1Uuid);
  expect(transition.workflow.uuid).toEqual(machineUuid);
  expect(transition.instance.uuid).toEqual(instanceUuid);

  expect(transition.nodeEnd.uuid).toEqual(nodes[0])
  expect(transition.nodeEnd.workflow.uuid).toEqual(machineUuid)
  expect(transition.nodeEnd.instance.uuid).toEqual(instanceUuid)
})

test('step', async () => {
  const state = await W.step(uuid, {uuid: transition1Uuid, data: mydata});
  console.log(JSON.stringify(state))

  const transition = state.transitions[0]

  expect(transition.uuid).toEqual(transition2Uuid);
})

test('state', async () => {
  const state = await W.state(uuid);

  if(!state.transitions) {
    throw Error('no state transitions')
  }

  const transition = state.transitions[0];

  console.log(state)

  expect(state.data).toEqual(mydata);
  expect(transition.uuid).toEqual(transition2Uuid);
  expect(transition.workflow.uuid).toEqual(machineUuid);
  expect(transition.instance.uuid).toEqual(instanceUuid);

  expect(transition.nodeEnd.uuid).toEqual(nodes[1])
  expect(transition.nodeEnd.workflow.uuid).toEqual(machineUuid)
  expect(transition.nodeEnd.instance.uuid).toEqual(instanceUuid)
})

