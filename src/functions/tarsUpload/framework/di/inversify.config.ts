import { Container } from 'inversify';
import { ITARSUploader } from '../../domain/ITARSUploader';
import { TYPES } from './types';
import { TARSUploader } from '../../domain/TARSUploader';
import { UploadInvoker } from '../../application/primary/UploadInvoker';
import { IBatchFetcher } from '../../application/secondary/IBatchFetcher';
import { ConfigurableBatchFetcher } from '../adapter/ConfigurableBatchFetcher';
import { ISubmissionReportingMediator } from '../../domain/ISubmissionReportingMediator';
import { SubmissionReportingMediator } from '../../domain/SubmissionReportingMediator';
import { IResultInterfaceCategoriser } from '../../domain/upload/IResultInterfaceCategoriser';
import { ResultInterfaceCategoriser } from '../../domain/ResultInterfaceCategoriser';

const container = new Container();

// Framework
// TODO: Implement a HTTP version when the endpoint is available - this version is just for testing
container.bind<IBatchFetcher>(TYPES.BatchFetcher).to(ConfigurableBatchFetcher);

// Application
container.bind<UploadInvoker>(UploadInvoker).toSelf();

// Domain
container.bind<ITARSUploader>(TYPES.TARSUploader).to(TARSUploader);
container.bind<ISubmissionReportingMediator>(TYPES.SubmissionReportingMediator).to(SubmissionReportingMediator);
container.bind<IResultInterfaceCategoriser>(TYPES.ResultInterfaceCategoriser).to(ResultInterfaceCategoriser);

export { container };
