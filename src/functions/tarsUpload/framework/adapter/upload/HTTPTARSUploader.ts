import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { ITARSHTTPConfig } from './ITARSHTTPConfig';
import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { UploadRetryCount } from '../../../domain/upload/UploadRetryCount';
import { TransientUploadError } from '../../../domain/upload/errors/TransientUploadError';
import { PermanentUploadError } from '../../../domain/upload/errors/PermanentUploadError';
import * as https from 'https';

@injectable()
export class HTTPTARSUploader implements ITARSUploader {

  axios: AxiosInstance;

  constructor(
    @inject(TYPES.TARSHTTPConfig) private tarsHttpConfig: ITARSHTTPConfig,
  ) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    this.axios = axios.create({
      httpsAgent,
      timeout: this.tarsHttpConfig.requestTimeoutMs,
    });
  }

  async uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    try {
      const endpoint = interfaceType === TARSInterfaceType.COMPLETED ?
        this.tarsHttpConfig.completedTestEndpoint : this.tarsHttpConfig.nonCompletedTestEndpoint;
      console.log(`submitting payload ${JSON.stringify(tarsPayload)}`);
      await this.axios.post(endpoint, tarsPayload);
      return 0;
    } catch (err) {
      throw this.mapHTTPErrorToDomainError(err);
    }
  }

  private mapHTTPErrorToDomainError(err: AxiosError): TransientUploadError | PermanentUploadError {
    const { request, response } = err;
    if (response) {
      console.log(`error in TARS response ${err.message}`);
      console.log(`response body was ${JSON.stringify(response.data)}`);
      return response.status >= 400 && response.status <= 499 ?
        new PermanentUploadError(err.message) :
        new TransientUploadError(err.message);
    }
    // Request was made, but no response received
    if (request) {
      return new TransientUploadError(err.message);
    }
    // Failed to setup the request
    return new PermanentUploadError(err.message);
  }

}
