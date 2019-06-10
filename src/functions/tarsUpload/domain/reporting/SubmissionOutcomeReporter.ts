import { ISubmissionOutcomeReporter } from './ISubmissionOutcomeReporter';
import { TARSUploadResult } from '../upload/TARSUploadResult';
import { injectable } from 'inversify';

@injectable()
export class SubmissionOutcomeReporter implements ISubmissionOutcomeReporter {
  reportSubmissionOutcome(attemptedSubmission: TARSUploadResult): Promise<void> {
    console.log(`reporting on ${attemptedSubmission}`);
    return Promise.resolve();
  }
}
