import { container } from '../../../di/inversify.config';
import { ITARSUploader } from '../../../../application/secondary/ITARSUploader';
import { TYPES } from '../../../di/types';
import * as nock from 'nock';
import { ITARSPayload } from '../../../../domain/upload/ITARSPayload';
import { TARSInterfaceType } from '../../../../domain/upload/TARSInterfaceType';
import { ITARSHTTPConfig } from '../ITARSHTTPConfig';
import { PermanentUploadError } from '../../../../domain/upload/errors/PermanentUploadError';
import { HTTPTARSUploader } from '../HTTPTARSUploader';
import { TransientUploadError } from '../../../../domain/upload/errors/TransientUploadError';

describe('HTTPTARSUploader', () => {
  let httpUploader: HTTPTARSUploader;
  const dummyTARSPayload: ITARSPayload = { applicationId: 123, bookingSequence: 4 };
  const fakeTARSEndpoint = 'http://localhost:3001';

  beforeEach(() => {
    container.rebind<ITARSHTTPConfig>(TYPES.TARSHTTPConfig).toConstantValue({
      completedTestEndpoint: fakeTARSEndpoint,
      nonCompletedTestEndpoint: fakeTARSEndpoint,
      requestTimeoutMs: 1000,
    });
    httpUploader = container.getNamed<HTTPTARSUploader>(TYPES.TARSUploader, 'http');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('axios error handling', () => {
    const assertResponseStatusResultsInErrorType = async (status: number, errorType: any) => {
      nock(fakeTARSEndpoint)
        .post('/')
        .reply(status);

      try {
        await httpUploader.uploadToTARS(dummyTARSPayload, TARSInterfaceType.COMPLETED);
      } catch (err) {
        expect(err instanceof errorType).toBeTruthy();
        return;
      }
      fail();
    };

    it('should throw a TransientUploadError when TARS indicates the rate limit was exceeded', async () => {
      await assertResponseStatusResultsInErrorType(429, TransientUploadError);
    });

    it('should throw a PermanentUploadError when TARS returns a 4xx that is not 429', async () => {
      await assertResponseStatusResultsInErrorType(422, PermanentUploadError);
    });

    it('should throw a TransientUploadError when TARS returns a 5xx', async () => {
      await assertResponseStatusResultsInErrorType(500, TransientUploadError);
    });
  });
});
