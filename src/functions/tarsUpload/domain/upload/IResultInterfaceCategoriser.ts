import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TestsByInterface } from './TestsByInterface';

export interface IResultInterfaceCategoriser {
  categoriseByInterface(batch: StandardCarTestCATBSchema[]): TestsByInterface;
}
