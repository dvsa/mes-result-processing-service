import { ISubmissionOutcomeReporter } from './ISubmissionOutcomeReporter';
import { TARSUploadResult } from '../upload/TARSUploadResult';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../framework/di/types';
import { ISubmissionOutcomeContextBuilder } from './ISubmissionOutcomeContextBuilder';

@injectable()
export class SubmissionOutcomeReporter implements ISubmissionOutcomeReporter {
  constructor(
    @inject(TYPES.SubmissionOutcomeContextBuilder) private ctxBuilder: ISubmissionOutcomeContextBuilder,
  ) { }
  reportSubmissionOutcome(attemptedSubmission: TARSUploadResult): Promise<void> {
    const submissionContext = this.ctxBuilder.buildSubmissionOutcomeContext(attemptedSubmission);
    console.log(`reporting on ${JSON.stringify(submissionContext)}`);
    return Promise.resolve();
  }
}
