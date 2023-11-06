import {AxiosError, AxiosResponseHeaders} from 'axios';
import {SubmissionOutcomeContext} from '../../../../../domain/reporting/SubmissionOutcomeContext';
import {UpdateUploadStatusError} from '../UpdateUploadStatusError';

describe('UpdateUploadStatusError', () => {
  it('should properly assign properties from SubmissionOutcomeContext and AxiosError', () => {
    const submissionOutcomeCtx = {
      applicationReference: 123456,
      outcomePayload: { staff_number: '1234567' },
    } as SubmissionOutcomeContext;

    const httpError = {
      config: {
        url: 'http://example.com',
        method: 'POST',
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        data: 'Not Found',
      },
    } as AxiosError;

    const error = new UpdateUploadStatusError('Error message', submissionOutcomeCtx, httpError);

    expect(error.applicationReference).toEqual(submissionOutcomeCtx.applicationReference);
    expect(error.outcomePayload).toEqual(submissionOutcomeCtx.outcomePayload);
    expect(error.url).toEqual(httpError.config?.url);
    expect(error.method).toEqual(httpError.config?.method);
    expect(error.status).toEqual(httpError.response?.status);
    expect(error.headers).toEqual(httpError.response?.headers as AxiosResponseHeaders);
    expect(error.data).toEqual(httpError.response?.data as string);
  });

  it('should handle an AxiosError without a response', () => {
    const submissionOutcomeCtx = {
      applicationReference: 123456,
      outcomePayload: { staff_number: '1234567' },
    } as SubmissionOutcomeContext;

    const httpError = {
      config: {
        url: 'http://example.com',
        method: 'POST',
      },
    } as Partial<AxiosError>;

    const error = new UpdateUploadStatusError('Error message', submissionOutcomeCtx, httpError as AxiosError);

    expect(error.status).toBeUndefined();
    expect(error.headers).toBeUndefined();
    expect(error.data).toBeUndefined();
  });
});
