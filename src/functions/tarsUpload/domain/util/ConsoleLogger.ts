import { ILogger } from './ILogger';
import { injectable } from 'inversify';

@injectable()
export class ConsoleLogger implements ILogger {
  debug(message: string): void {
    console.debug(`DEBUG: ${message}`);
  }
  error(message: string): void {
    console.error(`ERROR: ${message}`);
  }
  info(message: string): void {
    console.info(`INFO: ${message}`);
  }
  warn(message: string): void {
    console.warn(`WARN: ${message}`);
  }
  metric(message: string): void {
    console.log(message);
  }
}
