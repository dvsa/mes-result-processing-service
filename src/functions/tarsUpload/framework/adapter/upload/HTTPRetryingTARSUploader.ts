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
    console.log(`endpoint is either`);
    console.log(this.tarsHttpConfig.completedTestEndpoint);
    console.log(this.tarsHttpConfig.nonCompletedTestEndpoint);
    console.log(`I will allow ${this.tarsHttpConfig.maxRetriesPerUpload} retries`);
    return Promise.resolve();
  }

}
