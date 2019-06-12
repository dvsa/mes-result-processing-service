import * as nock  from 'nock';
import { StubBatchFetcher } from '../StubBatchFetcher';
import { container } from '../../../di/inversify.config';
import { IBatchFetcher } from '../../../../application/secondary/IBatchFetcher';
import { TYPES } from '../../../di/types';
import { dummyResponseArray } from './dummyReponse';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { EnvvarTestResultHTTPConfig } from '../../upload/EnvvarTestResultHTTPConfig';

describe('StubBatchFetcher', () => {
  let batchFetcher: StubBatchFetcher;

  beforeEach(() => {
    const testResultHTTPConfig = new EnvvarTestResultHTTPConfig();
    batchFetcher = new StubBatchFetcher(testResultHTTPConfig);

    container.rebind<IBatchFetcher>(TYPES.BatchFetcher).toConstantValue(batchFetcher);
    const scope = nock('http://localhost:3001')
      .get('/results')
      .reply(200, dummyResponseArray);
  });

  it('should extract and uncompress the data from the url provided', async () => {
    batchFetcher.fetchNextUploadBatch()
    .then((result: StandardCarTestCATBSchema[]) => {
      expect(result.length).toBe(2);
      expect(result[0].journalData.testSlotAttributes.slotId).toBe(1003);
      expect(result[1].journalData.testSlotAttributes.slotId).toBe(1005);
    });
  });
});
