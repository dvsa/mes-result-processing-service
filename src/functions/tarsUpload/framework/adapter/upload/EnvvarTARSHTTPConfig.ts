import { injectable } from 'inversify';

@injectable()
export class EnvvarTARSHTTPConfig {

  // The maximum number of requests that can be made for transient errors
  maxRetriesPerUpload: number;
  completedTestEndpoint: string;
  nonCompletedTestEndpoint: string;

  constructor() {
    this.maxRetriesPerUpload = this.getNumberFromEnv('TARS_MAX_RETRIES_PER_UPLOAD') || 2;
    this.completedTestEndpoint = this.getFromEnvThrowIfNotPresent('TARS_COMPLETED_TEST_ENDPOINT');
    this.nonCompletedTestEndpoint = this.getFromEnvThrowIfNotPresent('TARS_NON_COMPLETED_TEST_ENDPOINT');
  }

  private getNumberFromEnv(envvarName: string): number | null {
    const asNumber = Number.parseInt(process.env[envvarName] || '', 10);
    return Number.isNaN(asNumber) ? null : asNumber;
  }

  private getFromEnvThrowIfNotPresent(envvarName: string): string {
    const envvarVal = process.env[envvarName];
    if (envvarName === undefined || envvarName.trim().length === 0) {
      throw new Error(`Couldn't find envvar ${envvarName}`);
    }
    return envvarVal as string;
  }
}
