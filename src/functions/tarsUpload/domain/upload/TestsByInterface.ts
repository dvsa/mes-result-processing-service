import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

export interface TestsByInterface {
  completed: CatBUniqueTypes.TestResult[];
  nonCompleted: CatBUniqueTypes.TestResult[];
}
