import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import { inject, injectable, named } from 'inversify';
import { TYPES } from '../../di/types';
import bottleneck from 'bottleneck';

@injectable()
export class RateLimitingTARSUploader implements ITARSUploader {

  completedLimiter: bottleneck;

  constructor(
    @inject(TYPES.TARSUploader) @named('http') private innerUploader: ITARSUploader,
  ) {
    this.completedLimiter = new bottleneck({
      minTime: 5000,
    });
  }

  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<void> {
    return this.completedLimiter.schedule(() => this.innerUploader.uploadToTARS(tarsPayload, interfaceType));
  }

}
