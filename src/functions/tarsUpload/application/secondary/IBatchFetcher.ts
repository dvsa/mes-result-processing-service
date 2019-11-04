import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
export interface IBatchFetcher {
  fetchNextUploadBatch(): Promise<TestResultSchemasUnion[]>;
}
