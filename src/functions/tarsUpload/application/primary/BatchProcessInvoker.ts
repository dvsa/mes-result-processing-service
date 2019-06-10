import { injectable, inject } from 'inversify';
import { ITestResultBatchProcessor } from '../../domain/ITestResultBatchProcessor';
import { TYPES } from '../../framework/di/types';

@injectable()
export class BatchProcessInvoker {
  constructor(
    @inject(TYPES.TestResultBatchProcessor) private testResultBatchProcessor: ITestResultBatchProcessor,
  ) { }

  public async processNextBatch(): Promise<void> {
    return this.testResultBatchProcessor.processNextBatch();
  }
}
