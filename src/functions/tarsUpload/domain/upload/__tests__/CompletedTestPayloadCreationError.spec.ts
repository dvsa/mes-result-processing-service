import { dummyTests } from './__data__/DummyTests';
import { TARSPayloadConverter } from '../TARSPayloadConverter';
import { DateFormatter } from '../../../domain/util/DateFormatter';
import { CompletedTestInvalidCategoryError } from '../errors/CompletedTestInvalidCategoryError';

describe('CompletedTestPayloadCreationError', () => {
  const formatter = new DateFormatter();
  const converter = new TARSPayloadConverter(formatter);

  it('should error if unrecognised category on a valid test', () => {
    try {
      const result = converter.convertToCompletedTestPayload(dummyTests['passWithInvalidCategory']);
    } catch (err) {
      const expectedError = new CompletedTestInvalidCategoryError(dummyTests['passWithInvalidCategory']);
      expect(err).toEqual(expectedError);
    }
  });
});
