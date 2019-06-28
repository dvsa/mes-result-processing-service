import { Container } from 'inversify';
import { TYPES } from './types';
import { ITestResultBatchProcessor } from '../../domain/ITestResultBatchProcessor';
import { TestResultBatchProcessor } from '../../domain/TestResultBatchProcessor';
import { BatchProcessInvoker } from '../../application/primary/BatchProcessInvoker';
import { IBatchFetcher } from '../../application/secondary/IBatchFetcher';
import { HTTPBatchFetcher } from '../adapter/fetch/HTTPBatchFetcher';
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
import { RateLimitDecoratingTARSUploader } from '../adapter/upload/RateLimitDecoratingTARSUploader';
import { IDateFormatter } from '../../domain/util/IDateFormatter';
import { DateFormatter } from '../../domain/util/DateFormatter';
import { HTTPTARSUploader } from '../adapter/upload/HTTPTARSUploader';
import { ISubmissionOutcomeReporter } from '../../domain/reporting/ISubmissionOutcomeReporter';
import { SubmissionOutcomeReporter } from '../../domain/reporting/SubmissionOutcomeReporter';
import { ISubmissionOutcomeContextBuilder } from '../../domain/reporting/ISubmissionOutcomeContextBuilder';
import { SubmissionOutcomeContextBuilder } from '../../domain/reporting/SubmissionOutcomeContextBuilder';
import { ISubmissionOutcomeUploader } from '../../application/secondary/ISubmissionOutcomeUploader';
import { HTTPSubmissionOutcomeUploader } from '../adapter/report/HTTPSubmissionOutcomeUploader';
import { IOutcomeReportingHTTPConfig } from '../adapter/report/IOutcomeReportingHTTPConfig';
import { EnvvarOutcomeReportingHTTPConfig } from '../adapter/report/EnvvarOutcomeReportingHTTPConfig';
import { ITestResultHTTPConfig } from '../adapter/fetch/ITestResultHTTPConfig';
import { EnvvarTestResultHTTPConfig } from '../adapter/fetch/EnvvarTestResultHTTPConfig';
import { ITARSRateLimiterConfig } from '../adapter/upload/ITARSRateLimiterConfig';
import { TARSRateLimiterConfig } from '../adapter/upload/TARSRateLimiterConfig';
import { ILogger } from '../../domain/util/ILogger';
import { ConsoleLogger } from '../../domain/util/ConsoleLogger';
import { SuccessfulStubbingTARSUploader } from '../adapter/upload/SuccessfulStubbingTARSUploader';
import { ConfigurableBatchFetcher } from '../adapter/fetch/ConfigurableBatchFetcher';
import {
  SuccessfulStubbingSubmissionOutcomeUploader,
} from '../adapter/report/SuccessfulStubbingSubmissionOutcomeUploader';
import { IMetricSubmitter } from '../../application/secondary/IMetricSubmitter';
import { JSONLoggingMetricSubmitter } from '../adapter/metric/JSONLoggingMetricSubmitter';

const deriveTARSUploaderType = () => {
  if (process.env.USE_TARS_STUB === 'true') {
    return SuccessfulStubbingTARSUploader;
  }
  return HTTPTARSUploader;
};

const deriveBatchFetcherType = () => {
  if (process.env.USE_BATCH_FETCH_STUB === 'true') {
    return ConfigurableBatchFetcher;
  }
  return HTTPBatchFetcher;
};

const deriveSubmissionOutcomeUploaderType = () => {
  if (process.env.USE_SUBMISSION_OUTCOME_STUB === 'true') {
    return SuccessfulStubbingSubmissionOutcomeUploader;
  }
  return HTTPSubmissionOutcomeUploader;
};

const container = new Container();

// Framework
// TODO: Implement a HTTP version when the endpoint is available - this version is just for testing
container.bind<IBatchFetcher>(TYPES.BatchFetcher).to(deriveBatchFetcherType());
container.bind<ITARSHTTPConfig>(TYPES.TARSHTTPConfig).to(EnvvarTARSHTTPConfig);
container.bind<ITestResultHTTPConfig>(TYPES.TestResultHTTPConfig).to(EnvvarTestResultHTTPConfig);
container.bind<ITARSUploader>(TYPES.TARSUploader).to(RateLimitDecoratingTARSUploader).whenTargetIsDefault();
container.bind<ITARSUploader>(TYPES.TARSUploader).to(deriveTARSUploaderType()).whenTargetNamed('http');
container.bind<ISubmissionOutcomeUploader>(TYPES.SubmissionOutcomeUploader).to(deriveSubmissionOutcomeUploaderType());
container.bind<IOutcomeReportingHTTPConfig>(TYPES.OutcomeReportingHTTPConfig).to(EnvvarOutcomeReportingHTTPConfig);
container.bind<ITARSRateLimiterConfig>(TYPES.TARSRateLimiterConfig).to(TARSRateLimiterConfig);
container.bind<IMetricSubmitter>(TYPES.MetricSubmitter).to(JSONLoggingMetricSubmitter);

// Application
container.bind<BatchProcessInvoker>(BatchProcessInvoker).toSelf();

// Domain
container.bind<ITestResultBatchProcessor>(TYPES.TestResultBatchProcessor).to(TestResultBatchProcessor);
container.bind<ISubmissionReportingMediator>(TYPES.SubmissionReportingMediator).to(SubmissionReportingMediator);
container.bind<IResultInterfaceCategoriser>(TYPES.ResultInterfaceCategoriser).to(ResultInterfaceCategoriser);
container.bind<ITARSSubmissionFacade>(TYPES.TARSSubmissionFacade).to(TARSSubmissionFacade);
container.bind<ITARSPayloadConverter>(TYPES.TARSPayloadConverter).to(TARSPayloadConverter);
container.bind<IDateFormatter>(TYPES.DateFormatter).to(DateFormatter);
container.bind<ISubmissionOutcomeReporter>(TYPES.SubmissionOutcomeReporter).to(SubmissionOutcomeReporter);
container.bind<ISubmissionOutcomeContextBuilder>(TYPES.SubmissionOutcomeContextBuilder)
  .to(SubmissionOutcomeContextBuilder);
container.bind<ILogger>(TYPES.Logger).to(ConsoleLogger);

export { container };
