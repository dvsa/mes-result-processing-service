import { ISubmissionOutcomeUploader } from '../../../application/secondary/ISubmissionOutcomeUploader';
import { SubmissionOutcomeContext } from '../../../domain/reporting/SubmissionOutcomeContext';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { ILogger } from '../../../domain/util/ILogger';

@injectable()
export class SuccessfulStubbingSubmissionOutcomeUploader implements ISubmissionOutcomeUploader {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
  ) { }
  uploadSubmissionOutcome(submissionOutcomeCtx: SubmissionOutcomeContext): Promise<void> {
    this.logger.info(`In-memory submission outcome stub called with payload ${JSON.stringify(submissionOutcomeCtx)}`);
    return Promise.resolve();
  }
}
