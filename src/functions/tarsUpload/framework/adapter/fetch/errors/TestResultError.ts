import { AxiosError, AxiosResponseHeaders } from 'axios';

export class TestResultError extends Error {

  url: string | undefined;
  method: any;
  status: number | undefined;
  headers: AxiosResponseHeaders | undefined;
  data: string | undefined;

  constructor(message: string, httpError: AxiosError | null = null) {
    super(message);
    Object.setPrototypeOf(this, TestResultError.prototype);

    if (httpError && httpError.config) {
      this.url = httpError.config.url;
      this.method = httpError.config.method;
    }

    if (httpError && httpError.response) {
      this.status = httpError.response.status;
      this.headers = httpError.response.headers as AxiosResponseHeaders;
      this.data = httpError.response.data as unknown as string | undefined;
    }
  }
}
