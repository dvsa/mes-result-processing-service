import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { UploadRetryCount } from './UploadRetryCount';
import { ProcessingStatus } from '../reporting/ProcessingStatus';

export interface TARSUploadResult {
  test: TestResultSchemasUnion;
  status: ProcessingStatus;
  uploadRetryCount: UploadRetryCount;
  errorMessage?: string;
}
