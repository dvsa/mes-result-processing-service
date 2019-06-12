import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../upload/ITARSPayload';
import { TARSInterfaceType } from '../../upload/TARSInterfaceType';
import { injectable } from 'inversify';
import { UploadRetryCount } from '../../upload/UploadRetryCount';

export interface TARSUploaderCall {
  payload: ITARSPayload;
  interfaceType: TARSInterfaceType;
}

@injectable()
export class RecordingTARSUploader implements ITARSUploader {

  private errorForNextCall: Error | null = null;
  private calledWith: TARSUploaderCall[] = [];
  private retryCountForNextCall: number | null = null;

  uploadToTARS(payload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    this.calledWith = [...this.calledWith, { payload, interfaceType }];
    if (this.errorForNextCall) {
      return Promise.reject(this.errorForNextCall);
    }
    return Promise.resolve(this.retryCountForNextCall || 0);
  }

  rejectWithErrorOnNextCall(error: Error) {
    this.errorForNextCall = error;
  }

  getCalls(): TARSUploaderCall[] {
    return this.calledWith;
  }

  reportRetriesOnNextCall(retryCount: number) {
    this.retryCountForNextCall = retryCount;
  }

}
