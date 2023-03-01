import { IBatchFetcher } from '../../../application/secondary/IBatchFetcher';
import { injectable, inject } from 'inversify';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as zlib from 'zlib';
import { ITestResultHTTPConfig } from './ITestResultHTTPConfig';
import { TYPES } from '../../di/types';
import { TestResultError } from './errors/TestResultError';
import {customMetric} from '@dvsa/mes-microservice-common/application/utils/logger';
import {Metric} from '../../../domain/util/Metrics';
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
      const result = this.axios.get(endpoint);
      result.then((response) => {
        const resultList: TestResultSchemasUnion[] = [];
        if (!response.data) {
          customMetric(Metric.GetNextUploadBatchSuccess, 'Get next upload batch empty but successful for TARS');
          resolve(resultList);
          return;
        }
        const parseResult = response.data as string[];
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
            reject(new TestResultError('failed parsing test result'));
          }
        });
        customMetric(Metric.GetNextUploadBatchSuccess, 'Get next upload batch successful for TARS');
        resolve(resultList);
      }).catch((err) => {
        customMetric(Metric.GetNextUploadBatchFailure, 'Get next upload batch failed for TARS');
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
