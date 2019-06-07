import { Container } from 'inversify';
import { IBatchUploader } from '../../domain/IBatchUploader';
import { TYPES } from './types';
import { BatchUploader } from '../../domain/BatchUploader';
import { UploadBatchPort } from '../../application/inbound/UploadBatchPort';

const container = new Container();

// Ports
container.bind<UploadBatchPort>(UploadBatchPort).toSelf();

// Domain
container.bind<IBatchUploader>(TYPES.BatchUploader).to(BatchUploader);

export { container };
