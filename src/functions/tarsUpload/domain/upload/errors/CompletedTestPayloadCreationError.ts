import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

export class CompletedTestPayloadCreationError extends Error {
  constructor(invalidTest: StandardCarTestCATBSchema) {
    super(`Failed to build CompletedTestPayload for ${JSON.stringify(invalidTest)}`);
    Object.setPrototypeOf(this, CompletedTestPayloadCreationError);
  }
}
