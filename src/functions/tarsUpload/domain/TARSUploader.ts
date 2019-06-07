import { injectable, inject } from 'inversify';
import { ITARSUploader } from './ITARSUploader';
import { TYPES } from '../framework/di/types';
import { IBatchFetcher } from '../application/secondary/IBatchFetcher';
import { ISubmissionReportingMediator } from './ISubmissionReportingMediator';

@injectable()
export class TARSUploader implements ITARSUploader {
  constructor(
    @inject(TYPES.BatchFetcher) private batchFetcher: IBatchFetcher,
    @inject(TYPES.SubmissionReportingMediator) private submissionReportingMediator: ISubmissionReportingMediator,
  ) { }

  async uploadToTARS(): Promise<void> {
    const batchesToUpload = await this.batchFetcher.fetchNextUploadBatch();
    await this.submissionReportingMediator.submitBatchesAndReportOutcome(batchesToUpload);
  }
}
