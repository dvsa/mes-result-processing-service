import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import { inject, injectable, named } from 'inversify';
import { TYPES } from '../../di/types';
import bottleneck from 'bottleneck';
import { UploadRetryCount } from '../../../domain/upload/UploadRetryCount';

@injectable()
export class RateLimitDecoratingTARSUploader implements ITARSUploader {

  // We meter against requests against the (non)completed APIs separately.
  private completedLimiter: bottleneck;
  private nonCompletedLimiter: bottleneck;

  constructor(
    @inject(TYPES.TARSUploader) @named('http') private innerUploader: ITARSUploader,
  ) {
    this.completedLimiter = new bottleneck({
      minTime: 3000,
    });
    this.nonCompletedLimiter = new bottleneck({
      minTime: 3000,
    });
  }

  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    return interfaceType === TARSInterfaceType.COMPLETED ?
      this.completedLimiter.schedule(() => this.innerUploader.uploadToTARS(tarsPayload, interfaceType)) :
      this.nonCompletedLimiter.schedule(() => this.innerUploader.uploadToTARS(tarsPayload, interfaceType));
  }

}
