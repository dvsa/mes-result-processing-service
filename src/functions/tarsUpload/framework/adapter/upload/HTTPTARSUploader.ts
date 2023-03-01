import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { ITARSHTTPConfig } from './ITARSHTTPConfig';
import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { UploadRetryCount } from '../../../domain/upload/UploadRetryCount';
import { TransientUploadError } from '../../../domain/upload/errors/TransientUploadError';
import { PermanentUploadError } from '../../../domain/upload/errors/PermanentUploadError';
import * as https from 'https';
import { ILogger } from '../../../domain/util/ILogger';
import {customMetric} from '@dvsa/mes-microservice-common/application/utils/logger';
import {Metric} from '../../../domain/util/Metrics';

@injectable()
export class HTTPTARSUploader implements ITARSUploader {

  axios: AxiosInstance;

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

  async uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    const endpoint = interfaceType === TARSInterfaceType.COMPLETED ?
      this.tarsHttpConfig.completedTestEndpoint : this.tarsHttpConfig.nonCompletedTestEndpoint;

    return this.axios.post(endpoint, tarsPayload)
      .then(() => {
        customMetric(Metric.UploadToTARSSuccess, 'Uploading to TARS successful response');
        return 0 as UploadRetryCount;
      })
      .catch((err) => {
        const error: TransientUploadError |  PermanentUploadError = this.mapHTTPErrorToDomainError(err, tarsPayload);
        if (error.stack) {
          const errors: string[] = error.stack.split('    ');
          this.logger.error(errors[0].trim());
          this.logger.error(errors[1].trim());
          this.logger.error(errors[2].trim());
        }
        customMetric(Metric.UploadToTARSFailure, 'Uploading to TARS failure response');
        return Promise.reject(error);
      });
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
