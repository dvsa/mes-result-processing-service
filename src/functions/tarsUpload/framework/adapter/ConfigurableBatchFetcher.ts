import { IBatchFetcher } from '../../application/secondary/IBatchFetcher';
import { injectable } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

@injectable()
export class ConfigurableBatchFetcher implements IBatchFetcher {

  private nextBatch: StandardCarTestCATBSchema[] = [];

  fetchNextUploadBatch(): StandardCarTestCATBSchema[] {
    return this.nextBatch;
  }

  setNextBatch(nextBatch: StandardCarTestCATBSchema[]) {
    this.nextBatch = nextBatch;
  }
}
