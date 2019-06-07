import { IBatchFetcher } from '../application/inbound/IBatchFetcher';
import { injectable } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

@injectable()
export class BlankBatchFetcher implements IBatchFetcher {
  fetchNextUploadBatch(): StandardCarTestCATBSchema[] {
    return [];
  }
}
