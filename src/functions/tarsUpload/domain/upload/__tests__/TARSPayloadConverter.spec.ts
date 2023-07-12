import { dummyTests } from './__data__/DummyTests';
import { TARSPayloadConverter } from '../TARSPayloadConverter';
import { DateFormatter } from '../../../domain/util/DateFormatter';
import { CompletedTestInvalidCategoryError } from '../errors/CompletedTestInvalidCategoryError';
import { CompletedTestPayload } from '../CompletedTestPayload';
import { NonCompletedTestPayload } from '../NonCompletedTest';
import { TARSInterfaceType } from '../TARSInterfaceType';
import { Adi3ActivityCodes } from '../../util/ActivityCodes';

describe('TARSPayloadConverter', () => {
  const formatter = new DateFormatter();
  const tarsPayloadConverter = new TARSPayloadConverter(formatter);

  describe('convertToTARSPayload', () => {
    it('should return completed payload when interface type is completed', () => {
      spyOn(tarsPayloadConverter, 'convertToCompletedTestPayload').and
        .returnValue({passResult: true} as CompletedTestPayload);
      spyOn(tarsPayloadConverter, 'convertToNonCompletedTestPayload').and
        .returnValue({nonCompletionCode: 123} as NonCompletedTestPayload);
      const result = tarsPayloadConverter.convertToTARSPayload(dummyTests[''], TARSInterfaceType.COMPLETED);
      expect(result).toEqual({passResult: true} as CompletedTestPayload);
    });

    it('should return completed payload when interface type is completed', () => {
      spyOn(tarsPayloadConverter, 'convertToCompletedTestPayload').and
        .returnValue({passResult: true} as CompletedTestPayload);
      spyOn(tarsPayloadConverter, 'convertToNonCompletedTestPayload').and
        .returnValue({nonCompletionCode: 123} as NonCompletedTestPayload);
      const result = tarsPayloadConverter.convertToTARSPayload(dummyTests[''], TARSInterfaceType.NON_COMPLETED);
      expect(result).toEqual({nonCompletionCode: 123} as NonCompletedTestPayload);
    });
  });

  describe('convertToCompletedTestPayload', () => {
    it('should error if unrecognised category on a valid test', () => {
      try {
        const result =
          tarsPayloadConverter.convertToCompletedTestPayload(dummyTests['passWithInvalidCategory']);
      } catch (err) {
        const expectedError =
          new CompletedTestInvalidCategoryError(dummyTests['passWithInvalidCategory']);
        expect(err).toEqual(expectedError);
      }
    });
  });

  describe('getStandardCheckTestResult', () => {
    const testData = {
    };

    it('should return DAN when failed for public safety', () => {
      const result =
        tarsPayloadConverter.getStandardCheckTestResult(false, testData, 2, Adi3ActivityCodes.FAIL_PUBLIC_SAFETY);
      expect(result).toBe('FA3');
    });

    it('should return P when passResult is true', () => {
      const result = tarsPayloadConverter
        .getStandardCheckTestResult(true, testData, 2, Adi3ActivityCodes.PASS);
      expect(result).toBe('P');
    });

    it('should return FA3 if riskManagement below threshold and 2+ previous attempts', () => {
      const result = tarsPayloadConverter
        .getStandardCheckTestResult(false, testData, 2, Adi3ActivityCodes.FAIL);
      expect(result).toBe('FA3');
    });

    it('should return F2 if riskManagement above threshold and 1 previous attempts', () => {
      const data = {
        riskManagement: {
          score: 10,
        },
      };
      const result = tarsPayloadConverter
        .getStandardCheckTestResult(false, data, 1, Adi3ActivityCodes.FAIL);
      expect(result).toBe('F2');
    });
  });

  describe('AdiAttempts', () => {
    it('should increment the attempts by 1 for values between 0 and 2', () => {
      expect(tarsPayloadConverter.AdiAttempts(0)).toBe(1);
      expect(tarsPayloadConverter.AdiAttempts(1)).toBe(2);
      expect(tarsPayloadConverter.AdiAttempts(2)).toBe(3);
    });

    it('should return 3 for the value 3', () => {
      expect(tarsPayloadConverter.AdiAttempts(3)).toBe(3);
    });

    it('should return 1 for any other value', () => {
      expect(tarsPayloadConverter.AdiAttempts(-1)).toBe(1);
      expect(tarsPayloadConverter.AdiAttempts(undefined)).toBe(1);
      expect(tarsPayloadConverter.AdiAttempts(10)).toBe(3);
    });
  });
});
