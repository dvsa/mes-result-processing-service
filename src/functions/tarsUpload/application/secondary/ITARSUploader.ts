import { TARSInterfaceType } from '../../domain/upload/TARSInterfaceType';
import { ITARSPayload } from '../../domain/upload/ITARSPayload';

export interface ITARSUploader {
  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<void>;
}
