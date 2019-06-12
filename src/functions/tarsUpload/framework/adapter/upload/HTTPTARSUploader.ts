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

@injectable()
export class HTTPTARSUploader implements ITARSUploader {

  axios: AxiosInstance;

  constructor(
    @inject(TYPES.TARSHTTPConfig) private tarsHttpConfig: ITARSHTTPConfig,
  ) {
    this.axios = axios.create({
      timeout: this.tarsHttpConfig.requestTimeoutMs,
    });
  }

  async uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    try {
      const endpoint = interfaceType === TARSInterfaceType.COMPLETED ?
        this.tarsHttpConfig.completedTestEndpoint : this.tarsHttpConfig.nonCompletedTestEndpoint;
      await this.axios.post(endpoint, tarsPayload);
      return 0;
    } catch (err) {
      throw this.mapHTTPErrorToDomainError(err);
    }
  }

  private mapHTTPErrorToDomainError(err: AxiosError): TransientUploadError | PermanentUploadError {
    const { request, response } = err;
    if (response) {
      return response.status >= 400 && response.status <= 499 ?
        new PermanentUploadError(err.message) :
        new TransientUploadError(err.message);
    }
    // Request was made, but no response received
    if (request) {
      console.log(`******** transient no response`);
      return new TransientUploadError(err.message);
    }
    // Failed to setup the request
    return new PermanentUploadError(err.message);
  }

}
