import * as nock  from 'nock';
import { HttpBatchFetcher } from '../HttpBatchFetcher';
import { container } from '../../../di/inversify.config';
import { IBatchFetcher } from '../../../../application/secondary/IBatchFetcher';
import { TYPES } from '../../../di/types';
import { dummyResponseArray, invalidBase64Array, validBase64InvalidTestSchemna } from './dummyReponse';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { EnvvarTestResultHTTPConfig } from '../../upload/EnvvarTestResultHTTPConfig';

describe('HttpBatchFetcher', () => {
  let batchFetcher: HttpBatchFetcher;
  const testResultHTTPConfig = new EnvvarTestResultHTTPConfig();

  beforeEach(() => {
    batchFetcher = new HttpBatchFetcher(testResultHTTPConfig);
    container.rebind<IBatchFetcher>(TYPES.BatchFetcher).toConstantValue(batchFetcher);
  });

  afterEach(() => nock.cleanAll());

  describe('given a get request returns a valid response', () => {
    beforeEach(() => {
      nock('http://localhost:3001')
      .get('/results')
      .reply(200, dummyResponseArray);
    });

    it('should extract and uncompress the data from the url provided', async () => {
      const result = await batchFetcher.fetchNextUploadBatch();
      expect(result.length).toBe(2);
      expect(result[0].journalData.testSlotAttributes.slotId).toBe(1003);
      expect(result[1].journalData.testSlotAttributes.slotId).toBe(1005);
    });
  });

  describe('given a get request returns a 500 status code', () => {
    beforeEach(() => {
      nock('http://localhost:3001')
      .get('/results')
      .reply(500, 'error');
    });

    it('should throw an exception', async () => {
      batchFetcher.fetchNextUploadBatch().then(() => {
        fail();
      }).catch((err) => {
        const expectedError = new Error('Request failed with status code 500');
        expect(err).toEqual(expectedError);
      });
    });
  });

  describe('given a get request returns invalid base64 data', () => {
    beforeEach(() => {
      nock('http://localhost:3001')
      .get('/results')
      .reply(200, invalidBase64Array);
    });

    it('should throw an exception', async () => {

      batchFetcher.fetchNextUploadBatch().then((result: StandardCarTestCATBSchema[]) => { fail(); }).catch((err) => {
        const expectedError = new Error('failed decompressing test result');
        expect(err).toEqual(expectedError);
        return;
      });
    });
  });

  describe('given a get request returns data that does not match schema', () => {
    beforeEach(() => {
      nock('http://localhost:3001')
      .get('/results')
      .reply(200, validBase64InvalidTestSchemna);
    });

    it('should throw an exception', async () => {
      batchFetcher.fetchNextUploadBatch().then((result: StandardCarTestCATBSchema[]) => { fail(); }).catch((err) => {
        const expectedError = new Error('failed parsing test result');
        expect(err).toEqual(expectedError);
      });
    });
  });

});
