import 'reflect-metadata';
import { ITestResultBatchProcessor } from '../ITestResultBatchProcessor';
import { container } from '../../framework/di/inversify.config';
import { TYPES } from '../../framework/di/types';

describe('TestResultBatchProcessor', () => {
  let testResultBatchProcessor: ITestResultBatchProcessor;

  beforeEach(() => {
    testResultBatchProcessor = container.get<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor);
  });

  it('should not crash', () => {
    testResultBatchProcessor.processNextBatch();
  });
});
