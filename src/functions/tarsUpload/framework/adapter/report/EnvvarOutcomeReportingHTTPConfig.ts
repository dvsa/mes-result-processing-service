import { IOutcomeReportingHTTPConfig } from './IOutcomeReportingHTTPConfig';
import { EnvvarConfigProvider } from '../config/EnvvarConfigProvider';
import { injectable } from 'inversify';

@injectable()
export class EnvvarOutcomeReportingHTTPConfig extends EnvvarConfigProvider implements IOutcomeReportingHTTPConfig {
  outcomeReportingURLTemplate: string;

  constructor() {
    super();
    this.outcomeReportingURLTemplate = this.getFromEnvThrowIfNotPresent('OUTCOME_REPORTING_URL_TEMPLATE');
  }
}
