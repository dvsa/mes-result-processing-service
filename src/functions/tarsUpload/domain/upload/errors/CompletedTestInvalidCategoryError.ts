import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

export class CompletedTestInvalidCategoryError extends Error {
  constructor(invalidTest: TestResultSchemasUnion) {
    super(`Failed to build CompletedTestPayload due to invalid category for ${JSON.stringify(invalidTest)}`);
    Object.setPrototypeOf(this, CompletedTestInvalidCategoryError);
  }
}
