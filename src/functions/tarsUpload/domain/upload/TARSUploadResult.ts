import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSUploadStatus } from './TARSUploadStatus';
import { UploadRetryCount } from './UploadRetryCount';

export interface TARSUploadResult {
  test: StandardCarTestCATBSchema;
  status: TARSUploadStatus;
  uploadRetryCount: UploadRetryCount;
  errorMessage?: string;
}
