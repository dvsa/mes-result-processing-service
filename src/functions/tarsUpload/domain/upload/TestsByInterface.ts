import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSInterfaceType } from './TARSInterfaceType';

export interface TestsByInterface {
  completed: StandardCarTestCATBSchema[];
  nonCompleted: StandardCarTestCATBSchema[];
}
