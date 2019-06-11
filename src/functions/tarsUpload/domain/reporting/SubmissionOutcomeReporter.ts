import { ISubmissionOutcomeReporter } from './ISubmissionOutcomeReporter';
import { TARSUploadResult } from '../upload/TARSUploadResult';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../framework/di/types';
import { ISubmissionOutcomeContextBuilder } from './ISubmissionOutcomeContextBuilder';
import { ISubmissionOutcomeUploader } from '../../application/secondary/ISubmissionOutcomeUploader';

@injectable()
export class SubmissionOutcomeReporter implements ISubmissionOutcomeReporter {
  constructor(
    @inject(TYPES.SubmissionOutcomeContextBuilder) private ctxBuilder: ISubmissionOutcomeContextBuilder,
    @inject(TYPES.SubmissionOutcomeUploader) private submissionOutcomeUploader: ISubmissionOutcomeUploader,
  ) { }
  async reportSubmissionOutcome(attemptedSubmission: TARSUploadResult): Promise<void> {
    const submissionContext = this.ctxBuilder.buildSubmissionOutcomeContext(attemptedSubmission);
    await this.submissionOutcomeUploader.uploadSubmissionOutcome(submissionContext);
  }
}
