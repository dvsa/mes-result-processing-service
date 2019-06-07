import { IBatchUploader } from './IBatchUploader';
import { injectable } from 'inversify';

@injectable()
export class BatchUploader implements IBatchUploader {
  uploadBatch(): void {
    console.log('I did the upload');
  }
}
