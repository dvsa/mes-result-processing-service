import { ISubmissionReportingMediator } from './ISubmissionReportingMediator';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { injectable } from 'inversify';

@injectable()
export class SubmissionReportingMediator implements ISubmissionReportingMediator {
  async submitBatchesAndReportOutcome(batch: StandardCarTestCATBSchema[]): Promise<void> {
    console.log(`submitting and reporting on ${batch.length} results in an interleaved fashion`);
  }
}
