import { Container } from 'inversify';
import { TYPES } from './types';
import { ITestResultBatchProcessor } from '../../domain/ITestResultBatchProcessor';
import { TestResultBatchProcessor } from '../../domain/TestResultBatchProcessor';
import { BatchProcessInvoker } from '../../application/primary/BatchProcessInvoker';
import { IBatchFetcher } from '../../application/secondary/IBatchFetcher';
import { ConfigurableBatchFetcher } from '../adapter/fetch/ConfigurableBatchFetcher';
import { ISubmissionReportingMediator } from '../../domain/ISubmissionReportingMediator';
import { SubmissionReportingMediator } from '../../domain/SubmissionReportingMediator';
import { IResultInterfaceCategoriser } from '../../domain/upload/IResultInterfaceCategoriser';
import { ResultInterfaceCategoriser } from '../../domain/upload/ResultInterfaceCategoriser';
import { ITARSSubmissionFacade } from '../../domain/upload/ITARSSubmissionFacade';
import { ITARSHTTPConfig } from '../adapter/upload/ITARSHTTPConfig';
import { ITARSPayloadConverter } from '../../domain/upload/ITARSPayloadConverter';
import { TARSPayloadConverter } from '../../domain/upload/TARSPayloadConverter';
import { TARSSubmissionFacade } from '../../domain/upload/TARSSubmissionFacade';
import { ITARSUploader } from '../../application/secondary/ITARSUploader';
import { EnvvarTARSHTTPConfig } from '../adapter/upload/EnvvarTARSHTTPConfig';
import { RateLimitingTARSUploader } from '../adapter/upload/RateLimitingTARSUploader';
import { HTTPRetryingTARSUploader } from '../adapter/upload/HTTPRetryingTARSUploader';

const container = new Container();

// Framework
// TODO: Implement a HTTP version when the endpoint is available - this version is just for testing
container.bind<IBatchFetcher>(TYPES.BatchFetcher).to(ConfigurableBatchFetcher);
container.bind<ITARSHTTPConfig>(TYPES.TARSHTTPConfig).to(EnvvarTARSHTTPConfig);
// container.bind<ITARSUploader>(TYPES.TARSUploader).to(RateLimitingTARSUploader).whenTargetIsDefault();
container.bind<ITARSUploader>(TYPES.TARSUploader).to(HTTPRetryingTARSUploader); // .whenTargetNamed('http');

// Application
container.bind<BatchProcessInvoker>(BatchProcessInvoker).toSelf();

// Domain
container.bind<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor).to(TestResultBatchProcessor);
container.bind<ISubmissionReportingMediator>(TYPES.SubmissionReportingMediator).to(SubmissionReportingMediator);
container.bind<IResultInterfaceCategoriser>(TYPES.ResultInterfaceCategoriser).to(ResultInterfaceCategoriser);
container.bind<ITARSSubmissionFacade>(TYPES.TARSSubmissionFacade).to(TARSSubmissionFacade);
container.bind<ITARSPayloadConverter>(TYPES.TARSPayloadConverter).to(TARSPayloadConverter);

export { container };
