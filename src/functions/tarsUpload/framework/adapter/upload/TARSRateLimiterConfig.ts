import { EnvvarConfigProvider } from '../config/EnvvarConfigProvider';
import { ITARSRateLimiterConfig } from './ITARSRateLimiterConfig';

export class TARSRateLimiterConfig extends EnvvarConfigProvider implements ITARSRateLimiterConfig {

  maxRetries: number;
  requestIntervalMs: number;

  constructor() {
    super();
    this.maxRetries = this.getNumberFromEnv('TARS_MAX_RETRIES_PER_CALL') || 2;
    this.requestIntervalMs = this.getNumberFromEnv('TARS_REQUEST_INTERVAL_MS') || 500;
  }
}
