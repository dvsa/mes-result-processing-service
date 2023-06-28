import { ILogger } from './ILogger';
import { injectable } from 'inversify';
import {
  debug as commonDebug,
  error as commonError,
  info as commonInfo,
  warn as commonWarn,
} from '@dvsa/mes-microservice-common/application/utils/logger';

@injectable()
export class ConsoleLogger implements ILogger {
  debug(message: string): void {
    commonDebug(`DEBUG: ${message}`);
  }
  error(message: string): void {
    commonError(`ERROR: ${message}`);
  }
  info(message: string): void {
    commonInfo(`INFO: ${message}`);
  }
  warn(message: string): void {
    commonWarn(`WARN: ${message}`);
  }
  metric(message: string): void {
    console.log(message);
  }
}
