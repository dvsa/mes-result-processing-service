import { AxiosError } from 'axios';
import { SubmissionOutcomeContext } from '../../../../domain/reporting/SubmissionOutcomeContext';

export class UpdateUploadStatusError extends Error {

  applicationReference: number;
  outcomePayload: any;

  url: string | undefined;
  method: any;
  status: number | undefined;
  headers: string | undefined;
  data: string | undefined;

  constructor(message: string, submissionOutcomeCtx: SubmissionOutcomeContext, httpError: AxiosError) {
    super(message);
    Object.setPrototypeOf(this, UpdateUploadStatusError.prototype);

    this.applicationReference = submissionOutcomeCtx.applicationReference;
    this.outcomePayload = submissionOutcomeCtx.outcomePayload;

    if (httpError && httpError.config) {
      this.url = httpError.config.url;
      this.method = httpError.config.method;
    }

    if (httpError && httpError.response) {
      this.status = httpError.response.status;
      this.headers = httpError.response.headers;
      this.data = httpError.response.data;
    }
  }
}
