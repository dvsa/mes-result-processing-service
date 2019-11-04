import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { TestsByInterface } from './TestsByInterface';

export interface IResultInterfaceCategoriser {
  categoriseByInterface(batch: CatBUniqueTypes.TestResult[]): TestsByInterface;
}
