import { ISubmissionOutcomeContextBuilder } from './ISubmissionOutcomeContextBuilder';
import { TARSUploadResult } from '../upload/TARSUploadResult';
import { SubmissionOutcomeContext } from './SubmissionOutcomeContext';
import { injectable } from 'inversify';
import { formatApplicationReference } from '@dvsa/mes-microservice-common/domain/tars';

@injectable()
export class SubmissionOutcomeContextBuilder implements ISubmissionOutcomeContextBuilder {
  buildSubmissionOutcomeContext(uploadResult: TARSUploadResult): SubmissionOutcomeContext {
    const { journalData } = uploadResult.test;
    return {
      applicationReference: formatApplicationReference(journalData.applicationReference),
      outcomePayload: {
        staff_number: journalData.examiner.staffNumber,
        interface: 'TARS',
        state: uploadResult.status,
        retry_count: uploadResult.uploadRetryCount,
        error_message: uploadResult.errorMessage || null,
      },
    };
  }
}
