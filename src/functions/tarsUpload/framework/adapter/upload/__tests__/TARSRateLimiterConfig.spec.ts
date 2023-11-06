import {TARSRateLimiterConfig} from '../TARSRateLimiterConfig';

describe('TARSRateLimiterConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should set default values if environment variables are not set', () => {
    const config = new TARSRateLimiterConfig();
    expect(config.maxRetries).toBe(2);
    expect(config.requestsPerSecond).toBe(2);
  });

  it('should set maxRetries from the TARS_MAX_RETRIES_PER_CALL environment variable', () => {
    const testValue = 5;
    process.env.TARS_MAX_RETRIES_PER_CALL = testValue.toString();

    const config = new TARSRateLimiterConfig();
    expect(config.maxRetries).toBe(testValue);
  });

  it('should set requestsPerSecond from the TARS_REQUESTS_PER_SECOND environment variable', () => {
    const testValue = 10;
    process.env.TARS_REQUESTS_PER_SECOND = testValue.toString();

    const config = new TARSRateLimiterConfig();
    expect(config.requestsPerSecond).toBe(testValue);
  });
});
