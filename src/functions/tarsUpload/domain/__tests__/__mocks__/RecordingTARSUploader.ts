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

  private errors: Error[] = [];
  private calledWith: TARSUploaderCall[] = [];
  private retryCountForNextCall: number | null = null;

  uploadToTARS(payload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    this.calledWith = [...this.calledWith, { payload, interfaceType }];
    if (this.errors.length > 0) {
      const error = this.errors[0];
      this.errors = this.errors.slice(1);
      return Promise.reject(error);
    }
    return Promise.resolve(this.retryCountForNextCall || 0);
  }

  rejectWithErrorOnNextCall(error: Error) {
    this.errors = [error];
  }

  rejectWithErrorOnNextNCalls(error: Error, n: number = 1) {
    // tslint:disable-next-line:prefer-array-literal
    this.errors = [...this.errors, ...new Array(n).fill(error)];
  }

  getCalls(): TARSUploaderCall[] {
    return this.calledWith;
  }

  reportRetriesOnNextCall(retryCount: number) {
    this.retryCountForNextCall = retryCount;
  }

}
