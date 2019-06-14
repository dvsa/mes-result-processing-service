import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { ILogger } from '../../../domain/util/ILogger';

@injectable()
export class SuccessfulStubbingTARSUploader implements ITARSUploader {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
  ) { }
  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<number> {
    this.logger.info(`In-memory TARS stub called at ${new Date()} with payload ${JSON.stringify(tarsPayload)}`);
    return Promise.resolve(0);
  }
}
