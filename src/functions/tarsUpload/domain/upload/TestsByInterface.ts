import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

export interface TestsByInterface {
  completed: StandardCarTestCATBSchema[];
  nonCompleted: StandardCarTestCATBSchema[];
}
