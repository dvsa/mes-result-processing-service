import { Container } from 'inversify';
import { IBatchUploader } from '../../domain/IBatchUploader';
import { TYPES } from './types';
import { BatchUploader } from '../../domain/BatchUploader';
import { UploadBatchPort } from '../../application/inbound/UploadBatchPort';
import { IBatchFetcher } from '../../application/inbound/IBatchFetcher';
import { BlankBatchFetcher } from '../BlankBatchFetcher';

const container = new Container();

// Framework
container.bind<IBatchFetcher>(TYPES.BatchFetcher).to(BlankBatchFetcher);

// Application
container.bind<UploadBatchPort>(UploadBatchPort).toSelf();

// Domain
container.bind<IBatchUploader>(TYPES.BatchUploader).to(BatchUploader);

export { container };
