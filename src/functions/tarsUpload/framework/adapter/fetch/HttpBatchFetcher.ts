import { IBatchFetcher } from '../../../application/secondary/IBatchFetcher';
import { injectable, inject } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as zlib from 'zlib';
import { ITestResultHTTPConfig } from './ITestResultHTTPConfig';
import { TYPES } from '../../di/types';
import { TestResultError } from './errors/TestResultError';
@injectable()
export class HTTPBatchFetcher implements IBatchFetcher {

  private endpoint: string;
  axios: AxiosInstance;

  constructor(
    @inject(TYPES.TestResultHTTPConfig) private testResultHttpConfig: ITestResultHTTPConfig,
  ) {
    this.axios = axios.create({
    });
    this.endpoint = testResultHttpConfig.endpoint;
  }

  fetchNextUploadBatch(): Promise<StandardCarTestCATBSchema[]> {
    return new Promise((resolve, reject) => {
      const result = this.axios.get(this.endpoint);
      result.then((response) => {
        const resultList: StandardCarTestCATBSchema[] = [];
        if (!response.data) {
          resolve(resultList);
          return;
        }
        const parseResult = response.data;
        parseResult.forEach((element: string) => {
          let uncompressedResult: string = '';
          let test: StandardCarTestCATBSchema;

          try {
            uncompressedResult = zlib.gunzipSync(new Buffer(element, 'base64')).toString();
          } catch (e) {
            reject(new TestResultError('failed decompressing test result'));
          }

          try {
            test = JSON.parse(uncompressedResult);
            resultList.push(test);
          } catch (e) {
            reject(new TestResultError('failed parsing test result'));
          }
        });
        resolve(resultList);
      }).catch((err) => {
        reject(this.mapHTTPErrorToDomainError(err));
      });
    });
  }

  private mapHTTPErrorToDomainError(err: AxiosError): TestResultError {
    const { request, response } = err;
    if (response) {
      return new TestResultError(err.message);
    }
    // Request was made, but no response received
    if (request) {
      return new TestResultError(`no response received ${err.message}`);
    }
    // Failed to setup the request
    return new TestResultError(err.message);
  }
}
