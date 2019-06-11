import { ISubmissionOutcomeUploader } from '../../../application/secondary/ISubmissionOutcomeUploader';
import { SubmissionOutcomeContext } from '../../reporting/SubmissionOutcomeContext';

export class RecordingSubmissionOutcomeUploader implements ISubmissionOutcomeUploader {
  calls: SubmissionOutcomeContext[] = [];
  private nextCallRejection: Error | null = null;

  uploadSubmissionOutcome(submissionOutcomeCtx: SubmissionOutcomeContext): Promise<void> {
    this.calls = [...this.calls, submissionOutcomeCtx];
    if (this.nextCallRejection) {
      this.nextCallRejection = null;
      return Promise.reject(this.nextCallRejection);
    }
    return Promise.resolve();
  }

  setupRejectionOnNextCall(error: Error) {
    this.nextCallRejection = error;
  }

  reset() {
    this.calls = [];
  }
}
