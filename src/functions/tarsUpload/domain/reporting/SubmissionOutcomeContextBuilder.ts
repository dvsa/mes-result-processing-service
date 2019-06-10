import { ISubmissionOutcomeContextBuilder } from './ISubmissionOutcomeContextBuilder';
import { TARSUploadResult } from '../upload/TARSUploadResult';
import { SubmissionOutcomeContext } from './SubmissionOutcomeContext';
import { injectable } from 'inversify';
import { TARSInterfaceType } from '../upload/TARSInterfaceType';
import { ProcessingStatus } from './ProcessingStatus';

@injectable()
export class SubmissionOutcomeContextBuilder implements ISubmissionOutcomeContextBuilder {
  buildSubmissionOutcomeContext(uploadResult: TARSUploadResult): SubmissionOutcomeContext {
    return {
      applicationId: `${uploadResult.test.journalData.applicationReference.applicationId}`, // TODO:is string right?
      outcomePayload: {
        interface: 'TARS',
        state: ProcessingStatus.ACCEPTED,
        retry_count: uploadResult.uploadRetryCount,
        error_message: uploadResult.errorMessage || null,
      },
    };
  }
}
