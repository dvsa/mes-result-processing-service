import { ISubmissionOutcomeUploader } from '../../../application/secondary/ISubmissionOutcomeUploader';
import { SubmissionOutcomeContext } from '../../../domain/reporting/SubmissionOutcomeContext';
import { injectable, inject } from 'inversify';
import axios, { AxiosInstance } from 'axios';
import { IOutcomeReportingHTTPConfig } from './IOutcomeReportingHTTPConfig';
import { TYPES } from '../../di/types';

@injectable()
export class HTTPSubmissionOutcomeUploader implements ISubmissionOutcomeUploader {

  axios: AxiosInstance;

  constructor(
    @inject(TYPES.OutcomeReportingHTTPConfig) private outcomeReportingHTTPConfig: IOutcomeReportingHTTPConfig,
  ) {
    this.axios = axios.create();
  }
  uploadSubmissionOutcome(submissionOutcomeCtx: SubmissionOutcomeContext): Promise<void> {
    const putRequestUrl = this.buildParameterisedPutRequestURL(submissionOutcomeCtx);
    return this.axios.put(putRequestUrl, submissionOutcomeCtx.outcomePayload);
  }

  private buildParameterisedPutRequestURL(submissionOutcomeCtx: SubmissionOutcomeContext): string {
    const template = this.outcomeReportingHTTPConfig.outcomeReportingURLTemplate;
    return template.replace('{interface}', submissionOutcomeCtx.applicationReference);
  }
}
