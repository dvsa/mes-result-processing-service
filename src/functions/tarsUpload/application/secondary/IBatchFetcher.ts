import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

export interface IBatchFetcher {
  fetchNextUploadBatch(): Promise<CatBUniqueTypes.TestResult[]>;
}
