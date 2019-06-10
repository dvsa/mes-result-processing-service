import { ITARSSubmissionFacade } from './ITARSSubmissionFacade';
import { injectable, inject, named } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSInterfaceType } from './TARSInterfaceType';
import { TARSUploadResult } from './TARSUploadResult';
import { TYPES } from '../../framework/di/types';
import { ITARSPayloadConverter } from './ITARSPayloadConverter';
import { ITARSUploader } from '../../application/secondary/ITARSUploader';
import { TARSUploadStatus } from './TARSUploadStatus';

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
      return { test, uploadRetryCount, status: TARSUploadStatus.SUCCESSFUL };
    } catch (err) {
      // TODO: Categorise the error, find the actual retry count
      const uploadRetryCount = 0;
      return { test, uploadRetryCount, status: TARSUploadStatus.TRANSIENT_ERROR, errorMessage: err.message };
    }
  }

}
