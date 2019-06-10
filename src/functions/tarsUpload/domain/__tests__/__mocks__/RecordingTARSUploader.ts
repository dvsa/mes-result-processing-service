import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../upload/ITARSPayload';
import { TARSInterfaceType } from '../../upload/TARSInterfaceType';
import { injectable } from 'inversify';

export interface TARSUploaderCall {
  payload: ITARSPayload;
  interfaceType: TARSInterfaceType;
}

@injectable()
export class RecordingTARSUploader implements ITARSUploader {

  private errorForNextCall: Error | null = null;
  private calledWith: TARSUploaderCall[] = [];

  uploadToTARS(payload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<void> {
    this.calledWith = [...this.calledWith, { payload, interfaceType }];
    if (this.errorForNextCall) {
      return Promise.reject(this.errorForNextCall);
    }
    return Promise.resolve();
  }

  rejectWithErrorOnNextCall(error: Error) {
    this.errorForNextCall = error;
  }

  getCalls(): TARSUploaderCall[] {
    return this.calledWith;
  }

}
