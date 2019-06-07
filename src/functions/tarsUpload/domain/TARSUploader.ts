import { injectable, inject } from 'inversify';
import { ITARSUploader } from './ITARSUploader';
import { TYPES } from '../framework/di/types';
import { IBatchFetcher } from '../application/secondary/IBatchFetcher';

@injectable()
export class TARSUploader implements ITARSUploader {
  constructor(
    @inject(TYPES.BatchFetcher) private uploadBatchFetcher: IBatchFetcher,
  ) { }

  uploadToTARS(): Promise<void> {
    const batchesToUpload = this.uploadBatchFetcher.fetchNextUploadBatch();
    console.log(`I got ${batchesToUpload.length} batches`);
    return Promise.resolve();
  }
}
