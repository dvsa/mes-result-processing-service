import { ProcessingStatus } from './ProcessingStatus';
import { UploadRetryCount } from '../upload/UploadRetryCount';

export interface SubmissionOutcomeContext {
  applicationReference: string;
  outcomePayload: {
    staffNumber: string;
    interface: string;
    state: ProcessingStatus;
    retry_count: UploadRetryCount;
    error_message: string | null;
  };
}
