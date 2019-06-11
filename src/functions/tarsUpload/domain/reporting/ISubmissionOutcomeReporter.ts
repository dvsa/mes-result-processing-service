import { TARSUploadResult } from '../upload/TARSUploadResult';

export interface ISubmissionOutcomeReporter {
  reportSubmissionOutcome(attemptedSubmission: TARSUploadResult): Promise<void>;
}
