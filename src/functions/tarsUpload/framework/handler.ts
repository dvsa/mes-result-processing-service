import 'reflect-metadata';
import { Context, ScheduledEvent } from 'aws-lambda';
import { container } from './di/inversify.config';
import { UploadInvoker } from '../application/primary/UploadInvoker';

export async function handler(event: ScheduledEvent, fnCtx: Context): Promise<void> {
  const uploadPort = container.get<UploadInvoker>(UploadInvoker);
  await uploadPort.uploadToTARS();
}
