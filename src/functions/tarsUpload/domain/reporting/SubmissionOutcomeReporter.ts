import { ISubmissionOutcomeReporter } from './ISubmissionOutcomeReporter';
import { TARSUploadResult } from '../upload/TARSUploadResult';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../framework/di/types';
import { ISubmissionOutcomeContextBuilder } from './ISubmissionOutcomeContextBuilder';
import { ISubmissionOutcomeUploader } from '../../application/secondary/ISubmissionOutcomeUploader';
import { ILogger } from '../util/ILogger';
import { formatApplicationReference } from '@dvsa/mes-microservice-common/domain/tars';

@injectable()
export class SubmissionOutcomeReporter implements ISubmissionOutcomeReporter {
  constructor(
    @inject(TYPES.SubmissionOutcomeContextBuilder) private ctxBuilder: ISubmissionOutcomeContextBuilder,
    @inject(TYPES.SubmissionOutcomeUploader) private submissionOutcomeUploader: ISubmissionOutcomeUploader,
    @inject(TYPES.Logger) private logger: ILogger,
  ) { }
  async reportSubmissionOutcome(attemptedSubmission: TARSUploadResult): Promise<void> {
    try {
      const submissionContext = this.ctxBuilder.buildSubmissionOutcomeContext(attemptedSubmission);
      await this.submissionOutcomeUploader.uploadSubmissionOutcome(submissionContext);
    } catch (err) {
      const appRef = formatApplicationReference(attemptedSubmission.test.journalData.applicationReference);
      // tslint:disable-next-line:max-line-length
      this.logger.error(`Failed to update upload status with app ref ${appRef} to ${attemptedSubmission.status} with error ${JSON.stringify(err)}`);
    }
  }
}
