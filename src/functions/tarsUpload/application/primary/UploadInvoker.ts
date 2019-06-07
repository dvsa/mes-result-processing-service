import { injectable, inject } from 'inversify';
import { ITARSUploader } from '../../domain/ITARSUploader';
import { TYPES } from '../../framework/di/types';

@injectable()
export class UploadInvoker {
  constructor(
    @inject(TYPES.TARSUploader) private tarsUploader: ITARSUploader,
  ) { }

  public async uploadToTARS(): Promise<void> {
    return this.tarsUploader.uploadToTARS();
  }
}
