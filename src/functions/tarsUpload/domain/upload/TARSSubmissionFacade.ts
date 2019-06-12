import { ITARSSubmissionFacade } from './ITARSSubmissionFacade';
import { injectable, inject } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSInterfaceType } from './TARSInterfaceType';
import { TARSUploadResult } from './TARSUploadResult';
import { TYPES } from '../../framework/di/types';
import { ITARSPayloadConverter } from './ITARSPayloadConverter';
import { ITARSUploader } from '../../application/secondary/ITARSUploader';
import { UploadFailureWithRetryCountError } from './errors/UploadFailureWithRetryCountError';
import { ProcessingStatus } from '../reporting/ProcessingStatus';

@injectable()
export class TARSSubmissionFacade implements ITARSSubmissionFacade {
  constructor(
    @inject(TYPES.TARSPayloadConverter) private tarsPayloadConverter: ITARSPayloadConverter,
    @inject(TYPES.TARSUploader) private tarsUploader: ITARSUploader,
  ) { }
  async convertAndUpload(
    test: StandardCarTestCATBSchema,
    interfacetype: TARSInterfaceType,
  ): Promise<TARSUploadResult> {
    try {
      const tarsPayload = this.tarsPayloadConverter.convertToTARSPayload(test, interfacetype);
      const uploadRetryCount = await this.tarsUploader.uploadToTARS(tarsPayload, interfacetype);
      return { test, uploadRetryCount, status: ProcessingStatus.ACCEPTED };
    } catch (err) {
      const uploadRetryCount = err instanceof UploadFailureWithRetryCountError ? err.retryCount : 0;
      return { test, uploadRetryCount, status: ProcessingStatus.FAILED, errorMessage: err.message };
    }
  }

}
