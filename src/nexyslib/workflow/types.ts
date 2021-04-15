// NOTE: query parameters and headers are taken from HTTP request
export interface TransitionInput {
  uuid:string,
  data?:any,
  params?:any
}

export interface UOptionSet {
  uuid: string,
  name: string
}

export interface WorkflowInstance {
  workflow: UOptionSet,
  logDateAdded: Date,
  uuid: string
}

export type Constraint = any

// `Node` is a reserved word
export interface WFNode {
  uuid: string,
  instance: {uuid: string},
  workflow: {uuid: string},
  isEventDriven: boolean
}

export interface Transition {
  snippet: null,
  request: null,
  chain: null,
  instance: {uuid: string},
  workflow: {uuid: string},
  name: string,
  nodeStart?: WFNode,
  event: null,
  uuid: string,
  nodeEnd: WFNode,
  constraints: Constraint[]
}

export interface WorkflowState<A = any> {
  uuid?: string,
  node: WFNode,
  workflowInstance: WorkflowInstance,
  data: A,
  transitions?:Transition[]
}

export interface WorkflowStep<A=any> {
  message: string,
  state: WorkflowState<A>,
  transitions: Transition[]
}
