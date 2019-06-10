import { injectable } from 'inversify';
import { ITARSHTTPConfig } from './ITARSHTTPConfig';

@injectable()
export class EnvvarTARSHTTPConfig implements ITARSHTTPConfig {

  // The maximum number of requests that can be made for transient errors
  maxRetriesPerUpload: number;
  completedTestEndpoint: string;
  nonCompletedTestEndpoint: string;
  requestTimeoutMs: number;

  constructor() {
    this.maxRetriesPerUpload = this.getNumberFromEnv('TARS_MAX_RETRIES_PER_UPLOAD') || 2;
    this.completedTestEndpoint = this.getFromEnvThrowIfNotPresent('TARS_COMPLETED_TEST_ENDPOINT');
    this.nonCompletedTestEndpoint = this.getFromEnvThrowIfNotPresent('TARS_NON_COMPLETED_TEST_ENDPOINT');
    this.requestTimeoutMs = this.getNumberFromEnv('TARS_HTTP_TIMEOUT_MS') || 30000;
  }

  private getNumberFromEnv(envvarName: string): number | null {
    const asNumber = Number.parseInt(process.env[envvarName] || '', 10);
    return Number.isNaN(asNumber) ? null : asNumber;
  }

  private getFromEnvThrowIfNotPresent(envvarName: string): string {
    const envvarVal = process.env[envvarName];
    if (envvarVal === undefined || envvarVal.trim().length === 0) {
      throw new Error(`Couldn't find envvar ${envvarName}`);
    }
    return envvarVal as string;
  }
}
