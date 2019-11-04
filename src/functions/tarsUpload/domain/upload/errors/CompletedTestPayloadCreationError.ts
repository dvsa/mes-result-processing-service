import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

export class CompletedTestPayloadCreationError extends Error {
  constructor(invalidTest: CatBUniqueTypes.TestResult) {
    super(`Failed to build CompletedTestPayload for ${JSON.stringify(invalidTest)}`);
    Object.setPrototypeOf(this, CompletedTestPayloadCreationError);
  }
}
