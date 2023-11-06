import {EnvvarOutcomeReportingHTTPConfig} from '../EnvvarOutcomeReportingHTTPConfig';

describe('EnvvarOutcomeReportingHTTPConfig', () => {
  const originalProcessEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalProcessEnv };
  });

  afterAll(() => {
    process.env = originalProcessEnv;
  });

  it('should throw an error if OUTCOME_REPORTING_URL_TEMPLATE environment variable is not set', () => {
    // Arrange
    delete process.env.OUTCOME_REPORTING_URL_TEMPLATE;

    // Act & Assert
    expect(() => new EnvvarOutcomeReportingHTTPConfig()).toThrow();
  });

  it('should correctly assign OUTCOME_REPORTING_URL_TEMPLATE environment variable', () => {
    // Arrange
    const expectedValue = 'http://example.com/reporting/{app-ref}';
    process.env.OUTCOME_REPORTING_URL_TEMPLATE = expectedValue;

    // Act
    const config = new EnvvarOutcomeReportingHTTPConfig();

    // Assert
    expect(config.outcomeReportingURLTemplate).toBe(expectedValue);
  });
});
