import { SubmissionOutcomeContext } from '../../domain/reporting/SubmissionOutcomeContext';

export interface ISubmissionOutcomeUploader {
  uploadSubmissionOutcome(submissionOutcomeCtx: SubmissionOutcomeContext): Promise<void>;
}
