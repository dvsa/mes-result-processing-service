import 'reflect-metadata';
import { Context, ScheduledEvent } from 'aws-lambda';
import { container } from './di/inversify.config';
import { BatchProcessInvoker } from '../application/primary/BatchProcessInvoker';

export async function handler(event: ScheduledEvent, fnCtx: Context): Promise<void> {
  const uploadPort = container.get<BatchProcessInvoker>(BatchProcessInvoker);
  await uploadPort.processNextBatch();
}
