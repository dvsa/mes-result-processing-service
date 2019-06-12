import { IBatchFetcher } from '../../../application/secondary/IBatchFetcher';
import { injectable, inject } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import axios, { AxiosInstance } from 'axios';
import * as zlib from 'zlib';
import { ITestResultHTTPConfig } from '../upload/ITestResultHTTPConfig';
import { TYPES } from '../../di/types';
@injectable()
export class StubBatchFetcher implements IBatchFetcher {

  private endpoint: string;
  axios: AxiosInstance;

  private nextBatch: StandardCarTestCATBSchema[] = [];
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
        const parseResult = response.data;
        parseResult.forEach((element: string) => {
          const uncompressedResult = zlib.gunzipSync(new Buffer(element, 'base64')).toString();
          const test: StandardCarTestCATBSchema = JSON.parse(uncompressedResult);
          resultList.push(test);
        });
        resolve(resultList);
      });
    });
  }
}
