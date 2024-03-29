import { IBatchFetcher } from '../../../application/secondary/IBatchFetcher';
import { injectable, inject } from 'inversify';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as zlib from 'zlib';
import { ITestResultHTTPConfig } from './ITestResultHTTPConfig';
import { TYPES } from '../../di/types';
import { TestResultError } from './errors/TestResultError';
import { error, info } from '@dvsa/mes-microservice-common/application/utils/logger';

@injectable()
export class HTTPBatchFetcher implements IBatchFetcher {

  axios: AxiosInstance;

  constructor(
    @inject(TYPES.TestResultHTTPConfig) private testResultHttpConfig: ITestResultHTTPConfig,
  ) {
    this.axios = axios.create({
    });
  }

  fetchNextUploadBatch(): Promise<TestResultSchemasUnion[]> {
    const endpoint = this.getEndpointWithQueryParams();
    return new Promise((resolve, reject) => {
      this.axios.get(
        endpoint
      ).then((response) => {
        const parseResult = response.data as string[];
        const resultList: TestResultSchemasUnion[] = [];

        if (!parseResult) {
          resolve(resultList);
          return;
        }

        info(`Successfully read batch of ${parseResult.length}`);

        parseResult.forEach((element: string) => {
          let uncompressedResult: string = '';
          let test: TestResultSchemasUnion;

          try {
            uncompressedResult = zlib.gunzipSync(Buffer.from(element, 'base64')).toString();
          } catch (e) {
            reject(new TestResultError('failed decompressing test result'));
          }

          try {
            test = JSON.parse(uncompressedResult);
            resultList.push(test);
          } catch (e) {
            error('Failed to parse test result', uncompressedResult);
            reject(new TestResultError('failed parsing test result'));
          }
        });
        resolve(resultList);
      }).catch((err) => {
        reject(this.mapHTTPErrorToDomainError(err));
      });
    });
  }

  private getEndpointWithQueryParams() {
    return `${this.testResultHttpConfig.endpoint}?interface=TARS&batch_size=${this.testResultHttpConfig.batchSize}`;
  }

  private mapHTTPErrorToDomainError(err: AxiosError): TestResultError {
    const { request, response } = err;

    if (response) {
      return new TestResultError('Get Upload Batch failed', err);
    }
    // Request was made, but no response received
    if (request) {
      return new TestResultError('Get Upload Batch failed, no response received', err);
    }
    // Failed to setup the request
    return new TestResultError('Get Upload Batch failed, no response or request data available', err);
  }
}
