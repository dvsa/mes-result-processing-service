import { IBatchUploader } from './IBatchUploader';
import { injectable, inject } from 'inversify';
import { TYPES } from '../framework/di/types';
import { IBatchFetcher } from '../application/inbound/IBatchFetcher';

@injectable()
export class BatchUploader implements IBatchUploader {
  constructor(
    @inject(TYPES.BatchFetcher) private uploadBatchFetcher: IBatchFetcher,
  ) { }

  uploadBatch(): void {
    const batchesToUpload = this.uploadBatchFetcher.fetchNextUploadBatch();
    console.log(`I got ${batchesToUpload.length} batches`);
  }
}
