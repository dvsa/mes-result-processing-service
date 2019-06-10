import { ITARSPayload } from './ITARSPayload';

export interface NonCompletedTestPayload extends ITARSPayload {
  nonCompletionCode: number;
}
