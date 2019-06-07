import { injectable, inject } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { IBatchUploader } from '../../domain/IBatchUploader';
import { TYPES } from '../../framework/di/types';

@injectable()
export class UploadBatchPort {
  constructor(
    @inject(TYPES.BatchUploader) private batchUploader: IBatchUploader,
  ) { }

  public uploadBatch() {
    this.batchUploader.uploadBatch();
  }
}
