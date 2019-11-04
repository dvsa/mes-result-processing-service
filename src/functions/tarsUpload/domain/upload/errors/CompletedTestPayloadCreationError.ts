import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

export class CompletedTestPayloadCreationError extends Error {
  constructor(invalidTest: TestResultSchemasUnion) {
    super(`Failed to build CompletedTestPayload for ${JSON.stringify(invalidTest)}`);
    Object.setPrototypeOf(this, CompletedTestPayloadCreationError);
  }
}
