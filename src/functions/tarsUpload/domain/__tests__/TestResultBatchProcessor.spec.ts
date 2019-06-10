import 'reflect-metadata';
import { ITestResultBatchProcessor } from '../ITestResultBatchProcessor';
import { container } from '../../framework/di/inversify.config';
import { TYPES } from '../../framework/di/types';

describe('TestResultBatchProcessor', () => {
  let testResultBatchProcessor: ITestResultBatchProcessor;

  beforeEach(() => {
    process.env.TARS_COMPLETED_TEST_ENDPOINT = 'https://postman-echo.com/tarscompleted';
    process.env.TARS_NON_COMPLETED_TEST_ENDPOINT = 'https://postman-echo.com/tarsnoncompleted';
    testResultBatchProcessor = container.get<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor);
  });

  it('should not crash', async () => {
    await testResultBatchProcessor.processNextBatch();
  });
});
