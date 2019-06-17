import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { ITARSPayload } from '../../upload/ITARSPayload';
import { TARSInterfaceType } from '../../upload/TARSInterfaceType';
import { injectable } from 'inversify';
import { UploadRetryCount } from '../../upload/UploadRetryCount';

export interface TARSUploaderCall {
  payload: ITARSPayload;
  interfaceType: TARSInterfaceType;
  calledAt: number;
}

@injectable()
export class RecordingTARSUploader implements ITARSUploader {

  private errors: Error[] = [];
  private calledWith: TARSUploaderCall[] = [];
  private retryCountForNextCall: number | null = null;

  uploadToTARS(payload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    this.calledWith = [...this.calledWith, { payload, interfaceType, calledAt: Date.now() }];
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

  rejectWithErrorOnNextNCalls(error: Error, errorOccurrenceCount: number = 1) {
    // tslint:disable-next-line:prefer-array-literal
    this.errors = [...this.errors, ...new Array(errorOccurrenceCount).fill(error)];
  }

  getCalls(): TARSUploaderCall[] {
    return this.calledWith;
  }

  // Get the time difference between calls.
  // The first entry will be the number of ms that call 2 occurred after call 1.
  getCallMsTimings(): number[] {
    return this.calledWith
      .map(call => call.calledAt)
      .reduce((differences: number[], calledAt, i, calls) => {
        if (i < calls.length - 1) {
          return [...differences, (calls[i + 1] - calledAt)];
        }
        return differences;
      },      []);
  }

  reportRetriesOnNextCall(retryCount: number) {
    this.retryCountForNextCall = retryCount;
  }

}
