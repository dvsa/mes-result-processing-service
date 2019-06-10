import { ITARSPayload } from '../../domain/upload/ITARSPayload';
import { TARSInterfaceType } from '../../domain/upload/TARSInterfaceType';
import { UploadRetryCount } from '../../domain/upload/UploadRetryCount';

export interface ITARSUploader {
  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount>;
}
