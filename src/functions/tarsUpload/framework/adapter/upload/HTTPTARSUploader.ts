import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { ITARSHTTPConfig } from './ITARSHTTPConfig';
import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { UploadRetryCount } from '../../../domain/upload/UploadRetryCount';
import { TransientUploadError } from '../../../domain/upload/errors/TransientUploadError';
import { PermanentUploadError } from '../../../domain/upload/errors/PermanentUploadError';
import * as https from 'https';
import { ILogger } from '../../../domain/util/ILogger';
import { timed } from '../../../domain/util/TimingDecorator';

@injectable()
export class HTTPTARSUploader implements ITARSUploader {

  private axios: AxiosInstance;

  constructor(
    @inject(TYPES.TARSHTTPConfig) private tarsHttpConfig: ITARSHTTPConfig,
    @inject(TYPES.Logger) private logger: ILogger,
  ) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    this.axios = axios.create({
      httpsAgent,
      timeout: this.tarsHttpConfig.requestTimeoutMs,
    });
  }

  @timed('TARSHTTPUploadTimeTakenMs', 'The number of ms taken to upload a payload to TARS')
  async uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    try {
      const endpoint = interfaceType === TARSInterfaceType.COMPLETED ?
        this.tarsHttpConfig.completedTestEndpoint : this.tarsHttpConfig.nonCompletedTestEndpoint;
      await this.axios.post(endpoint, tarsPayload);
      return 0;
    } catch (err) {
      throw this.mapHTTPErrorToDomainError(err, tarsPayload);
    }
  }

  private mapHTTPErrorToDomainError(
    err: AxiosError,
    tarsPayload: ITARSPayload,
  ): TransientUploadError | PermanentUploadError {
    const { request, response } = err;
    if (response) {
      if (this.responseIndicatesRateLimitExceeded(response)) {
        this.logger.warn('Rate limit exceeded');
        return new TransientUploadError('Rate limit exceeded');
      }
      if (this.responseIndicates4xxError(response)) {
        this.logger.warn(`4xx error received for payload ${tarsPayload}: ${JSON.stringify(response.data)}`);
        return new PermanentUploadError(err.message);
      }
      return new TransientUploadError(err.message);
    }
    // Request was made, but no response received
    if (request) {
      return new TransientUploadError(err.message);
    }
    // Failed to setup the request
    return new PermanentUploadError(err.message);
  }

  private responseIndicatesRateLimitExceeded(response: AxiosResponse) {
    return response.status === 429;
  }

  private responseIndicates4xxError(response: AxiosResponse) {
    return response.status >= 400 && response.status <= 499;
  }

}
