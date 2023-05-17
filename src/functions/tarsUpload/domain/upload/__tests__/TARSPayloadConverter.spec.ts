import { dummyTests } from './__data__/DummyTests';
import { TARSPayloadConverter } from '../TARSPayloadConverter';
import { DateFormatter } from '../../../domain/util/DateFormatter';
import { CompletedTestInvalidCategoryError } from '../errors/CompletedTestInvalidCategoryError';

describe('TARSPayloadConverter', () => {
  const formatter = new DateFormatter();
  const tarsPayloadConverter = new TARSPayloadConverter(formatter);

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
