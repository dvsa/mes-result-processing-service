import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestsByInterface } from './TestsByInterface';

export interface IResultInterfaceCategoriser {
  categoriseByInterface(batch: TestResultSchemasUnion[]): TestsByInterface;
}
