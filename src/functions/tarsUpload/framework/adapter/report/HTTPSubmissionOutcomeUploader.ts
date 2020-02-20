import { ISubmissionOutcomeUploader } from '../../../application/secondary/ISubmissionOutcomeUploader';
import { SubmissionOutcomeContext } from '../../../domain/reporting/SubmissionOutcomeContext';
import { injectable, inject } from 'inversify';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { IOutcomeReportingHTTPConfig } from './IOutcomeReportingHTTPConfig';
import { TYPES } from '../../di/types';
import { UpdateUploadStatusError } from './errors/UpdateUploadStatusError';
import { ILogger } from '../../../domain/util/ILogger';

@injectable()
export class HTTPSubmissionOutcomeUploader implements ISubmissionOutcomeUploader {

  axios: AxiosInstance;

  constructor(
    @inject(TYPES.OutcomeReportingHTTPConfig) private outcomeReportingHTTPConfig: IOutcomeReportingHTTPConfig,
    @inject(TYPES.Logger) private logger: ILogger,
  ) {
    this.axios = axios.create();
  }
  uploadSubmissionOutcome(submissionOutcomeCtx: SubmissionOutcomeContext): Promise<void> {
    const putRequestUrl = this.buildParameterisedPutRequestURL(submissionOutcomeCtx);
    return this.axios
      .put(putRequestUrl, submissionOutcomeCtx.outcomePayload)
      .then(() => Promise.resolve())
      .catch((err) => {
        const error: UpdateUploadStatusError = this.mapHTTPErrorToDomainError(err, submissionOutcomeCtx);
        this.logger.error(this.stringfyError(error));
        return Promise.reject(error);
      });
  }

  private buildParameterisedPutRequestURL(submissionOutcomeCtx: SubmissionOutcomeContext): string {
    const template = this.outcomeReportingHTTPConfig.outcomeReportingURLTemplate;
    return template.replace('{app-ref}', submissionOutcomeCtx.applicationReference.toString());
  }

  private mapHTTPErrorToDomainError(
    err: AxiosError, submissionOutcomeCtx: SubmissionOutcomeContext): UpdateUploadStatusError {

    const { request, response } = err;
    if (response) {
      return new UpdateUploadStatusError(`Update Upload Status failed`, submissionOutcomeCtx , err);
    }
    // Request was made, but no response received
    if (request) {
      return new UpdateUploadStatusError(
        `Update Upload Status failed, no response received`,
        submissionOutcomeCtx,
        err,
      );
    }
    // Failed to setup the request
    return new UpdateUploadStatusError(
      `Update Upload Status failed, no response or request data available`,
      submissionOutcomeCtx,
      err)
    ;
  }

  private stringfyError(error: UpdateUploadStatusError) : string {
    error.headers = JSON.stringify(error.headers);
    error.outcomePayload = JSON.stringify(error.outcomePayload);
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  }
}
