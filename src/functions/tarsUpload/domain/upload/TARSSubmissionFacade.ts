import { ITARSSubmissionFacade } from './ITARSSubmissionFacade';
import { injectable, inject } from 'inversify';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TARSInterfaceType } from './TARSInterfaceType';
import { TARSUploadResult } from './TARSUploadResult';
import { TYPES } from '../../framework/di/types';
import { ITARSPayloadConverter } from './ITARSPayloadConverter';
import { ITARSUploader } from '../../application/secondary/ITARSUploader';
import { UploadFailureWithRetryCountError } from './errors/UploadFailureWithRetryCountError';
import { ProcessingStatus } from '../reporting/ProcessingStatus';
import { ILogger } from '../util/ILogger';
import { formatApplicationReference } from '@dvsa/mes-microservice-common/domain/tars';

@injectable()
export class TARSSubmissionFacade implements ITARSSubmissionFacade {
  constructor(
    @inject(TYPES.TARSPayloadConverter) private tarsPayloadConverter: ITARSPayloadConverter,
    @inject(TYPES.TARSUploader) private tarsUploader: ITARSUploader,
    @inject(TYPES.Logger) private logger: ILogger,
  ) { }
  async convertAndUpload(
    test: TestResultSchemasUnion,
    interfacetype: TARSInterfaceType,
  ): Promise<TARSUploadResult> {
    try {
      const tarsPayload = this.tarsPayloadConverter.convertToTARSPayload(test, interfacetype);
      const uploadRetryCount = await this.tarsUploader.uploadToTARS(tarsPayload, interfacetype);
      return { test, uploadRetryCount, status: ProcessingStatus.ACCEPTED };
    } catch (err) {
      const uploadRetryCount = err instanceof UploadFailureWithRetryCountError ? err.retryCount : 0;
      const appRef = formatApplicationReference(test.journalData.applicationReference);
      // tslint:disable-next-line:max-line-length
      this.logger.error(`Failed to upload to tars with app ref ${appRef}, current retry count ${uploadRetryCount}, see previous logs for more details`);
      return { test, uploadRetryCount, status: ProcessingStatus.FAILED, errorMessage: err.message };
    }
  }

}
