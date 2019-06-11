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
import { ISubmissionOutcomeUploader } from '../../application/secondary/ISubmissionOutcomeUploader';
import { RecordingSubmissionOutcomeUploader } from './__mocks__/RecordingSubmissionOutcomeUploader';
import { ProcessingStatus } from '../reporting/ProcessingStatus';

describe('TestResultBatchProcessor', () => {
  let testResultBatchProcessor: ITestResultBatchProcessor;
  let batchFetcher: ConfigurableBatchFetcher;
  let tarsUploader: RecordingTARSUploader;
  let outcomeUploader: RecordingSubmissionOutcomeUploader;

  beforeEach(() => {
    batchFetcher = new ConfigurableBatchFetcher();
    tarsUploader = new RecordingTARSUploader();
    outcomeUploader = new RecordingSubmissionOutcomeUploader();

    container.rebind<IBatchFetcher>(TYPES.BatchFetcher).toConstantValue(batchFetcher);
    container.rebind<ITARSUploader>(TYPES.TARSUploader).toConstantValue(tarsUploader);
    container.rebind<ISubmissionOutcomeUploader>(TYPES.SubmissionOutcomeUploader).toConstantValue(outcomeUploader);

    testResultBatchProcessor = container.get<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor);
  });

  it('should submit a single non-completed test payload to TARS and the update outcome', async () => {
    batchFetcher.setNextBatch([dummyTests.fail1]);

    await testResultBatchProcessor.processNextBatch();

    expect(tarsUploader.getCalls().length).toBe(1);
    expect(tarsUploader.getCalls()[0].interfaceType).toBe(TARSInterfaceType.NON_COMPLETED);
    expect(tarsUploader.getCalls()[0].payload as NonCompletedTestPayload).toEqual({
      applicationId: 1234571,
      bookingSequence: 2,
      nonCompletionCode: 51,
    });
    expect(outcomeUploader.calls.length).toBe(1);
    expect(outcomeUploader.calls[0]).toEqual({
      applicationReference: '123457126',
      outcomePayload: {
        state: ProcessingStatus.ACCEPTED,
        interface: 'TARS',
        retry_count: 0,
        error_message: null,
      },
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
    expect(outcomeUploader.calls.length).toBe(1);
    expect(outcomeUploader.calls[0]).toEqual({
      applicationReference: '123456919',
      outcomePayload: {
        state: ProcessingStatus.ACCEPTED,
        interface: 'TARS',
        retry_count: 0,
        error_message: null,
      },
    });
  });
});
