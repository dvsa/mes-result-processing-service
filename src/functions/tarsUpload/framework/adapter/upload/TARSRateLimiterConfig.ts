import { EnvvarConfigProvider } from '../config/EnvvarConfigProvider';
import { ITARSRateLimiterConfig } from './ITARSRateLimiterConfig';

export class TARSRateLimiterConfig extends EnvvarConfigProvider implements ITARSRateLimiterConfig {

  maxRetries: number;
  requestsPerSecond: number;

  constructor() {
    super();
    this.maxRetries = this.getNumberFromEnv('TARS_MAX_RETRIES_PER_CALL') || 2;
    this.requestsPerSecond = this.getNumberFromEnv('TARS_REQUESTS_PER_SECOND') || 2;
  }
}
