import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

export interface ISubmissionReportingMediator {
  submitBatchesAndReportOutcome(batch: StandardCarTestCATBSchema[]): Promise<void>;
}
