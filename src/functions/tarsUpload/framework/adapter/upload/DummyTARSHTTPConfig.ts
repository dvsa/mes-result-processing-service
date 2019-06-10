import { ITARSHTTPConfig } from './ITARSHTTPConfig';
import { injectable } from 'inversify';

@injectable()
export class DummyTARSHTTPConfig implements ITARSHTTPConfig {
  maxRetriesPerUpload: number = 2;
  completedTestEndpoint: string = 'https://example.com/complete';
  nonCompletedTestEndpoint: string = 'https://example.com/non-complete';
}
