import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSUploadStatus } from './TARSUploadStatus';

export interface TARSUploadResult {
  test: StandardCarTestCATBSchema;
  status: TARSUploadStatus;
  errorMessage?: string;
}
