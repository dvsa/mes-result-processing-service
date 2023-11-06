import 'reflect-metadata';
import { Container } from 'inversify';
import {ITestResultBatchProcessor} from '../../../domain/ITestResultBatchProcessor';
import {TYPES} from '../../../framework/di/types';
import {BatchProcessInvoker} from '../BatchProcessInvoker';

describe('BatchProcessInvoker', () => {
  let mockProcessor: jasmine.SpyObj<ITestResultBatchProcessor>;
  let batchProcessInvoker: BatchProcessInvoker;

  beforeEach(() => {
    mockProcessor = jasmine.createSpyObj('ITestResultBatchProcessor', ['processNextBatch']);

    const container = new Container();
    container.bind<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor).toConstantValue(mockProcessor);

    batchProcessInvoker = container.resolve(BatchProcessInvoker);
  });

  it('should call processNextBatch on the testResultBatchProcessor', async () => {
    // Arrange
    mockProcessor.processNextBatch.and.returnValue(Promise.resolve());

    // Act
    await batchProcessInvoker.processNextBatch();

    // Assert
    expect(mockProcessor.processNextBatch).toHaveBeenCalled();
  });
});
