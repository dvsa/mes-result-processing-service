import { Container } from 'inversify';
import { TYPES } from './types';
import { ITestResultBatchProcessor } from '../../domain/ITestResultBatchProcessor';
import { TestResultBatchProcessor } from '../../domain/TestResultBatchProcessor';
import { BatchProcessInvoker } from '../../application/primary/BatchProcessInvoker';
import { IBatchFetcher } from '../../application/secondary/IBatchFetcher';
import { ConfigurableBatchFetcher } from '../adapter/ConfigurableBatchFetcher';
import { ISubmissionReportingMediator } from '../../domain/ISubmissionReportingMediator';
import { SubmissionReportingMediator } from '../../domain/SubmissionReportingMediator';
import { IResultInterfaceCategoriser } from '../../domain/upload/IResultInterfaceCategoriser';
import { ResultInterfaceCategoriser } from '../../domain/upload/ResultInterfaceCategoriser';
import { ITarsUploadFacade } from '../../domain/upload/ITarsUploadFacade';
import { TARSUploadFacade } from '../../domain/upload/TARSUploadFacade';

const container = new Container();

// Framework
// TODO: Implement a HTTP version when the endpoint is available - this version is just for testing
container.bind<IBatchFetcher>(TYPES.BatchFetcher).to(ConfigurableBatchFetcher);

// Application
container.bind<BatchProcessInvoker>(BatchProcessInvoker).toSelf();

// Domain
container.bind<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor).to(TestResultBatchProcessor);
container.bind<ISubmissionReportingMediator>(TYPES.SubmissionReportingMediator).to(SubmissionReportingMediator);
container.bind<IResultInterfaceCategoriser>(TYPES.ResultInterfaceCategoriser).to(ResultInterfaceCategoriser);
container.bind<ITarsUploadFacade>(TYPES.TarsUploadFacade).to(TARSUploadFacade);

export { container };
