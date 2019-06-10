import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { ITARSHTTPConfig } from './ITARSHTTPConfig';
import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import axios, { AxiosInstance } from 'axios';

@injectable()
export class HTTPRetryingTARSUploader implements ITARSUploader {

  axios: AxiosInstance;

  constructor(
    @inject(TYPES.TARSHTTPConfig) private tarsHttpConfig: ITARSHTTPConfig,
  ) {
    this.axios = axios.create({
      timeout: this.tarsHttpConfig.requestTimeoutMs,
    });
  }

  async uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<void> {
    console.log(`uploading ${JSON.stringify(tarsPayload)}`);
    console.log(`endpoint is either`);
    console.log(this.tarsHttpConfig.completedTestEndpoint);
    console.log(this.tarsHttpConfig.nonCompletedTestEndpoint);
    console.log(`I will allow ${this.tarsHttpConfig.maxRetriesPerUpload} retries`);
    console.log(`axios client is ${this.axios}`);
    const resp = await this.axios.post(this.tarsHttpConfig.completedTestEndpoint, tarsPayload);
    console.log(`HTTP RESP: ${resp}`);
    return Promise.resolve();
  }

}
