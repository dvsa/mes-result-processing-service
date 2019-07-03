import 'reflect-metadata';
import { Context, ScheduledEvent } from 'aws-lambda';

export async function handler(event: ScheduledEvent, fnCtx: Context): Promise<void> {
  console.log('invoked');
}
