import { TARSUploadResult } from './upload/TARSUploadResult';

export interface ISubmissionOutcomeReporter {
  reportSubmissionOutcome(attemptedSubmissions: TARSUploadResult[]): Promise<void>;
}
