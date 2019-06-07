import 'reflect-metadata';
import { Context, ScheduledEvent } from 'aws-lambda';
import { container } from './di/inversify.config';
import { UploadBatchPort } from '../application/inbound/UploadBatchPort';

export async function handler(event: ScheduledEvent, fnCtx: Context): Promise<void> {
  const uploadPort = container.get<UploadBatchPort>(UploadBatchPort);
  uploadPort.uploadBatch();
  return;
}
