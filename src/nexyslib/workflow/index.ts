import ProductService from '../product';

import { TransitionInput, WorkflowInstance, WorkflowState, WorkflowStep } from './types';

export default class WorkflowService extends ProductService {
  /**
   * init workflow 
   * @param workflow
   * @param transition: transition input
   * @return workflow instance | transition state
   */
  async init(workflowUuid:string, transition?:TransitionInput):Promise<WorkflowInstance> {
    // TODO: headers, query
    const payload = { uuid: workflowUuid, transition };
    return await this.request('/workflow/init', payload);
  }

  /**
   * move workflow instance a step ahead in the workflow
   * @param workflowInstance
   * @param transition: transition input
   * @return transition state
   */
  async step<A=any>(workflowInstanceUuid:string, transition:TransitionInput):Promise<WorkflowStep<A>> {
    // TODO: headers, query
    const payload = {
      uuid: workflowInstanceUuid,
      transition
    };

    return await this.request('/workflow/step', payload);
  }

  /**
   * get state of workflow instance
   * @param workflowInstance
   * @param transition
   * @return workflow state with next transitions
   */
  async state<A=any>(workflowInstanceUuid:string):Promise<WorkflowState<A>> {
    const payload = { uuid: workflowInstanceUuid };
    return this.request('/workflow/state', payload);
  }
};
