import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

export interface ISubmissionReportingMediator {
  submitBatchesAndReportOutcome(batch: TestResultSchemasUnion[]): Promise<void>;
}
