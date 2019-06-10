import { injectable, inject } from 'inversify';
import { ITestResultBatchProcessor } from './ITestResultBatchProcessor';
import { TYPES } from '../framework/di/types';
import { IBatchFetcher } from '../application/secondary/IBatchFetcher';
import { ISubmissionReportingMediator } from './ISubmissionReportingMediator';

@injectable()
export class TestResultBatchProcessor implements ITestResultBatchProcessor {
  constructor(
    @inject(TYPES.BatchFetcher) private batchFetcher: IBatchFetcher,
    @inject(TYPES.SubmissionReportingMediator) private submissionReportingMediator: ISubmissionReportingMediator,
  ) { }

  async processNextBatch(): Promise<void> {
    const batchesToUpload = await this.batchFetcher.fetchNextUploadBatch();
    await this.submissionReportingMediator.submitBatchesAndReportOutcome(batchesToUpload);
  }
}
