import 'reflect-metadata';
import { ITestResultBatchProcessor } from '../ITestResultBatchProcessor';
import { container } from '../../framework/di/inversify.config';
import { TYPES } from '../../framework/di/types';
import { ITARSUploader } from '../../application/secondary/ITARSUploader';
import { RecordingTARSUploader } from './__mocks__/RecordingTARSUploader';
import { IBatchFetcher } from '../../application/secondary/IBatchFetcher';
import { ConfigurableBatchFetcher } from '../../framework/adapter/fetch/ConfigurableBatchFetcher';
import { dummyTests } from './__data__/DummyTests';
import { TARSInterfaceType } from '../upload/TARSInterfaceType';
import { NonCompletedTestPayload } from '../upload/NonCompletedTest';
import { CompletedTestPayload } from '../upload/CompletedTestPayload';

describe('TestResultBatchProcessor', () => {
  let testResultBatchProcessor: ITestResultBatchProcessor;
  let batchFetcher: ConfigurableBatchFetcher;
  let tarsUploader: RecordingTARSUploader;

  beforeEach(() => {
    batchFetcher = new ConfigurableBatchFetcher();
    tarsUploader = new RecordingTARSUploader();

    container.rebind<IBatchFetcher>(TYPES.BatchFetcher).toConstantValue(batchFetcher);
    container.rebind<ITARSUploader>(TYPES.TARSUploader).toConstantValue(tarsUploader);

    testResultBatchProcessor = container.get<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor);
  });

  it('should submit a single uncompleted test payload to TARS', async () => {
    batchFetcher.setNextBatch([dummyTests.fail1]);

    await testResultBatchProcessor.processNextBatch();

    expect(tarsUploader.getCalls().length).toBe(1);
    expect(tarsUploader.getCalls()[0].interfaceType).toBe(TARSInterfaceType.UNCOMPLETED);
    expect(tarsUploader.getCalls()[0].payload as NonCompletedTestPayload).toEqual({
      applicationId: 1234571,
      bookingSequence: 2,
      nonCompletionCode: 51,
    });
  });

  it('should submit a single pass payload to TARS', async () => {
    batchFetcher.setNextBatch([dummyTests.pass1]);

    await testResultBatchProcessor.processNextBatch();

    expect(tarsUploader.getCalls().length).toBe(1);
    expect(tarsUploader.getCalls()[0].interfaceType).toBe(TARSInterfaceType.COMPLETED);
    expect(tarsUploader.getCalls()[0].payload as CompletedTestPayload).toEqual({
      applicationId: 1234569,
      bookingSequence: 1,
      checkDigit: 9,
      languageId: 'W',
      licenceSurrender: true,
      dL25Category: 'B',
      dL25TestType: 2,
      automaticTest: false,
      extendedTest: false,
      d255Selected: true,
      passResult: true,
      driverNumber: 'DOEXX625220A99HC',
      testDate: '10/06/2019',
      passCertificate: 'passcert',
    });
  });
});
