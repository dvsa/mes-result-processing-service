import { injectable } from 'inversify';
import { ITestResultHTTPConfig } from './ITestResultHTTPConfig';
import { EnvvarConfigProvider } from '../config/EnvvarConfigProvider';

@injectable()
export class EnvvarTestResultHTTPConfig extends EnvvarConfigProvider implements ITestResultHTTPConfig {

  endpoint: string;
  constructor() {
    super();
    this.endpoint = this.getFromEnvThrowIfNotPresent('TEST_RESULT_ENDPOINT');
  }

}
