import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { ITARSHTTPConfig } from './ITARSHTTPConfig';
import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';

@injectable()
export class HTTPRetryingTARSUploader implements ITARSUploader {

  constructor(
    @inject(TYPES.TARSHTTPConfig) private tarsHttpConfig: ITARSHTTPConfig,
  ) { }

  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<void> {
    console.log(`uploading ${JSON.stringify(tarsPayload)}`);
    return Promise.resolve();
  }

}
