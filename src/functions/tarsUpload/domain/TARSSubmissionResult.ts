import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSSubmissionStatus } from './TARSSubmissionStatus';

export interface TARSSubmissionResult {
  test: StandardCarTestCATBSchema;
  status: TARSSubmissionStatus;
  errorMessage?: string;
}
