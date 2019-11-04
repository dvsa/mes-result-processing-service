import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

export interface TestsByInterface {
  completed: TestResultSchemasUnion[];
  nonCompleted: TestResultSchemasUnion[];
}
