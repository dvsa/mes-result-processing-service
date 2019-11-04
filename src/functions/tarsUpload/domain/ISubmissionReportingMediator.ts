import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

export interface ISubmissionReportingMediator {
  submitBatchesAndReportOutcome(batch: CatBUniqueTypes.TestResult[]): Promise<void>;
}
