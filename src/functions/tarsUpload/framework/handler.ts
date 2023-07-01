import 'reflect-metadata';
import { ScheduledEvent } from 'aws-lambda';
import { bootstrapLogging, error, info } from '@dvsa/mes-microservice-common/application/utils/logger';
import { container } from './di/inversify.config';
import { BatchProcessInvoker } from '../application/primary/BatchProcessInvoker';

export async function handler(event: ScheduledEvent): Promise<void> {
  try {
    bootstrapLogging('result-processing-service', event);

    info('Calling processNextBatch');
    const uploadPort = container.get<BatchProcessInvoker>(BatchProcessInvoker);
    await uploadPort.processNextBatch();

    info('Processed successfully');
  } catch (err) {
    error('### err', err);
    throw(err);
  }
}
