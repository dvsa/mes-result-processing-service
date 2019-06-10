import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../upload/ITARSPayload';
import { TARSInterfaceType } from '../../upload/TARSInterfaceType';
import { injectable } from 'inversify';

@injectable()
export class RecordingTARSUploader implements ITARSUploader {

  private errorForNextCall: Error | null = null;
  private calledWith: [ITARSPayload, TARSInterfaceType][] = [];

  uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<void> {
    this.calledWith = [...this.calledWith, [tarsPayload, interfaceType]];
    if (this.errorForNextCall) {
      return Promise.reject(this.errorForNextCall);
    }
    return Promise.resolve();
  }

  rejectWithErrorOnNextCall(error: Error) {
    this.errorForNextCall = error;
  }

  getCalls(): [ITARSPayload, TARSInterfaceType][] {
    return this.calledWith;
  }

}
