import {AxiosError, AxiosResponseHeaders} from 'axios';
import {TestResultError} from '../TestResultError';

describe('TestResultError', () => {
  it('should correctly assign properties from AxiosError', () => {
    const mockAxiosError = {
      config: {
        url: 'http://example.com/api/test',
        method: 'GET',
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        data: 'Internal Server Error',
      },
    } as AxiosError;

    const testResultError = new TestResultError('An error occurred', mockAxiosError);

    expect(testResultError.message).toBe('An error occurred');
    expect(testResultError.url).toBe(mockAxiosError.config?.url);
    expect(testResultError.method).toBe(mockAxiosError.config?.method);
    expect(testResultError.status).toBe(mockAxiosError.response?.status);
    expect(testResultError.headers).toEqual(mockAxiosError.response?.headers as AxiosResponseHeaders);
    expect(testResultError.data).toBe(mockAxiosError.response?.data as string);
  });

  it('should have undefined http properties if no AxiosError is provided', () => {
    const testResultError = new TestResultError('An error occurred');

    expect(testResultError.message).toBe('An error occurred');
    expect(testResultError.url).toBeUndefined();
    expect(testResultError.method).toBeUndefined();
    expect(testResultError.status).toBeUndefined();
    expect(testResultError.headers).toBeUndefined();
    expect(testResultError.data).toBeUndefined();
  });
});
