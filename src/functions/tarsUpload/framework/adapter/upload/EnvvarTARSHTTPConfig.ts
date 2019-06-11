import { injectable } from 'inversify';
import { ITARSHTTPConfig } from './ITARSHTTPConfig';
import { EnvvarConfigProvider } from '../config/EnvvarConfigProvider';

@injectable()
export class EnvvarTARSHTTPConfig extends EnvvarConfigProvider implements ITARSHTTPConfig {

  // The maximum number of requests that can be made for transient errors
  maxRetriesPerUpload: number;
  completedTestEndpoint: string;
  nonCompletedTestEndpoint: string;
  requestTimeoutMs: number;

  constructor() {
    super();
    this.maxRetriesPerUpload = this.getNumberFromEnv('TARS_MAX_RETRIES_PER_UPLOAD') || 2;
    this.completedTestEndpoint = this.getFromEnvThrowIfNotPresent('TARS_COMPLETED_TEST_ENDPOINT');
    this.nonCompletedTestEndpoint = this.getFromEnvThrowIfNotPresent('TARS_NON_COMPLETED_TEST_ENDPOINT');
    this.requestTimeoutMs = this.getNumberFromEnv('TARS_HTTP_TIMEOUT_MS') || 30000;
  }
}
