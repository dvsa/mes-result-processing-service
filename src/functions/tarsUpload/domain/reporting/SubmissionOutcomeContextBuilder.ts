import { ISubmissionOutcomeContextBuilder } from './ISubmissionOutcomeContextBuilder';
import { TARSUploadResult } from '../upload/TARSUploadResult';
import { SubmissionOutcomeContext } from './SubmissionOutcomeContext';
import { injectable } from 'inversify';
import { ProcessingStatus } from './ProcessingStatus';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/B';

@injectable()
export class SubmissionOutcomeContextBuilder implements ISubmissionOutcomeContextBuilder {
  buildSubmissionOutcomeContext(uploadResult: TARSUploadResult): SubmissionOutcomeContext {
    const { journalData } = uploadResult.test;
    return {
      applicationReference: this.buildApplicationReferenceIdentifer(journalData.applicationReference),
      outcomePayload: {
        staffNumber: journalData.examiner.staffNumber,
        interface: 'TARS',
        state: ProcessingStatus.ACCEPTED,
        retry_count: uploadResult.uploadRetryCount,
        error_message: uploadResult.errorMessage || null,
      },
    };
  }

  private buildApplicationReferenceIdentifer(appRef: ApplicationReference): string {
    return `${appRef.applicationId}${appRef.bookingSequence}${appRef.checkDigit}`;
  }
}
