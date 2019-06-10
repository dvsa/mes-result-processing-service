import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

export interface IBatchFetcher {
  fetchNextUploadBatch(): Promise<StandardCarTestCATBSchema[]>;
}
