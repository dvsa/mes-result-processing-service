import { Container } from 'inversify';
import { ITARSUploader } from '../../domain/ITARSUploader';
import { TYPES } from './types';
import { TARSUploader } from '../../domain/TARSUploader';
import { UploadInvoker } from '../../application/primary/UploadInvoker';
import { IBatchFetcher } from '../../application/secondary/IBatchFetcher';
import { ConfigurableBatchFetcher } from '../adapter/ConfigurableBatchFetcher';

const container = new Container();

// Framework
container.bind<IBatchFetcher>(TYPES.BatchFetcher).to(ConfigurableBatchFetcher);

// Application
container.bind<UploadInvoker>(UploadInvoker).toSelf();

// Domain
container.bind<ITARSUploader>(TYPES.TARSUploader).to(TARSUploader);

export { container };
