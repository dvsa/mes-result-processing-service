import { injectable } from 'inversify';
import { ITestResultHTTPConfig } from './ITestResultHTTPConfig';
import { EnvvarConfigProvider } from '../config/EnvvarConfigProvider';

@injectable()
export class EnvvarTestResultHTTPConfig extends EnvvarConfigProvider implements ITestResultHTTPConfig {

  endpoint: string;
  batchSize: number;

  constructor() {
    super();
    this.endpoint = this.getFromEnvDefaultIfNotPresent('TEST_RESULT_ENDPOINT', 'http://localhost:3001/results');
    this.batchSize = this.getNumberFromEnv('TEST_UPLOAD_BATCH_SIZE') || 25;
  }

}
