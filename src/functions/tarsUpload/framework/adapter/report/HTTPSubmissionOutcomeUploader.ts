import { ISubmissionOutcomeUploader } from '../../../application/secondary/ISubmissionOutcomeUploader';
import { SubmissionOutcomeContext } from '../../../domain/reporting/SubmissionOutcomeContext';
import { injectable } from 'inversify';

@injectable()
export class HTTPSubmissionOutcomeUploader implements ISubmissionOutcomeUploader {
  uploadSubmissionOutcome(submissionOutcomeCtx: SubmissionOutcomeContext): Promise<void> {
    return Promise.resolve();
  }
}
