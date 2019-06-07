import { TARSSubmissionResult } from './TARSSubmissionResult';

export interface ISubmissionOutcomeReporter {
  reportSubmissionOutcome(attemptedSubmissions: TARSSubmissionResult[]): Promise<void>;
}
