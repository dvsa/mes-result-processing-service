import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { UploadRetryCount } from './UploadRetryCount';
import { ProcessingStatus } from '../reporting/ProcessingStatus';

export interface TARSUploadResult {
  test: StandardCarTestCATBSchema;
  status: ProcessingStatus;
  uploadRetryCount: UploadRetryCount;
  errorMessage?: string;
}
