import { ITARSPayload } from '../../domain/upload/ITARSPayload';
import { TARSInterfaceType } from '../../domain/upload/TARSInterfaceType';

export interface ITARSUploader {
  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<void>;
}
