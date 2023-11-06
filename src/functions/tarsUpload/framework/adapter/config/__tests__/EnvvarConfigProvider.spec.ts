import {EnvvarConfigProvider} from '../EnvvarConfigProvider';

describe('EnvvarConfigProvider', () => {
  let envvarConfigProvider: any; // Casting to any to access protected methods for testing

  beforeEach(() => {
    class TestEnvvarConfigProvider extends EnvvarConfigProvider {} // Extend the abstract class
    envvarConfigProvider = new TestEnvvarConfigProvider();
  });

  describe('getNumberFromEnv', () => {
    it('should return null if environment variable is not a number', () => {
      process.env.TEST_NUMBER = 'not_a_number';
      expect(envvarConfigProvider.getNumberFromEnv('TEST_NUMBER')).toBeNull();
    });

    it('should return the number if environment variable is a valid number', () => {
      process.env.TEST_NUMBER = '123';
      expect(envvarConfigProvider.getNumberFromEnv('TEST_NUMBER')).toBe(123);
    });
  });

  describe('getFromEnvThrowIfNotPresent', () => {
    it('should throw an error if environment variable is not present', () => {
      expect(() => {
        envvarConfigProvider.getFromEnvThrowIfNotPresent('MISSING_ENVVAR');
      }).toThrow();
    });

    it('should return the value if environment variable is present', () => {
      process.env.EXISTING_ENVVAR = 'value';
      expect(envvarConfigProvider.getFromEnvThrowIfNotPresent('EXISTING_ENVVAR')).toBe('value');
    });
  });

  describe('getFromEnvDefaultIfNotPresent', () => {
    it('should return the default value if environment variable is not present', () => {
      expect(envvarConfigProvider.getFromEnvDefaultIfNotPresent('MISSING_ENVVAR', 'default'))
        .toBe('default');
    });

    it('should return the value of the environment variable if it is present', () => {
      process.env.EXISTING_ENVVAR = 'value';
      expect(envvarConfigProvider.getFromEnvDefaultIfNotPresent('EXISTING_ENVVAR', 'default'))
        .toBe('value');
    });
  });
});
