import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { UploadRetryCount } from './UploadRetryCount';
import { ProcessingStatus } from '../reporting/ProcessingStatus';

export interface TARSUploadResult {
  test: CatBUniqueTypes.TestResult;
  status: ProcessingStatus;
  uploadRetryCount: UploadRetryCount;
  errorMessage?: string;
}
