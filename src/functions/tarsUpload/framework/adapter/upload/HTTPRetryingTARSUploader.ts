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
    const endpoint = interfaceType === TARSInterfaceType.COMPLETED ?
      this.tarsHttpConfig.completedTestEndpoint : this.tarsHttpConfig.nonCompletedTestEndpoint;
    return this.axios.post(endpoint, tarsPayload);
  }

}
