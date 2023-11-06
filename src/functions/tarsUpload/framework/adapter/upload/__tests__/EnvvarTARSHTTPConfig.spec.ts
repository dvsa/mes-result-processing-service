import {EnvvarTARSHTTPConfig} from '../EnvvarTARSHTTPConfig';

describe('EnvvarTARSHTTPConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default values for maxRetriesPerUpload and requestTimeoutMs if env vars are not set', () => {
    process.env.TARS_COMPLETED_TEST_ENDPOINT = 'http://completed.example.com';
    process.env.TARS_NON_COMPLETED_TEST_ENDPOINT = 'http://noncompleted.example.com';

    const config = new EnvvarTARSHTTPConfig();

    expect(config.maxRetriesPerUpload).toBe(2);
    expect(config.requestTimeoutMs).toBe(30000);
    expect(config.completedTestEndpoint).toBe(process.env.TARS_COMPLETED_TEST_ENDPOINT);
    expect(config.nonCompletedTestEndpoint).toBe(process.env.TARS_NON_COMPLETED_TEST_ENDPOINT);
  });

  it('should throw an error if required TARS_* endpoints are not provided', () => {
    expect(() => {
      new EnvvarTARSHTTPConfig();
    }).toThrowError();
  });

  it('should correctly set the maxRetriesPerUpload and requestTimeoutMs from environment variables', () => {
    process.env.TARS_MAX_RETRIES_PER_UPLOAD = '5';
    process.env.TARS_COMPLETED_TEST_ENDPOINT = 'http://completed.example.com';
    process.env.TARS_NON_COMPLETED_TEST_ENDPOINT = 'http://noncompleted.example.com';
    process.env.TARS_HTTP_TIMEOUT_MS = '10000';

    const config = new EnvvarTARSHTTPConfig();

    expect(config.maxRetriesPerUpload).toBe(5);
    expect(config.requestTimeoutMs).toBe(10000);
  });
});
