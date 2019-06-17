import { RateLimitDecoratingTARSUploader } from '../RateLimitDecoratingTARSUploader';
import { RecordingTARSUploader } from '../../../../domain/__tests__/__mocks__/RecordingTARSUploader';
import { ITARSRateLimiterConfig } from '../ITARSRateLimiterConfig';
import { TARSInterfaceType } from '../../../../domain/upload/TARSInterfaceType';
import { ITARSPayload } from '../../../../domain/upload/ITARSPayload';
import { TransientUploadError } from '../../../../domain/upload/errors/TransientUploadError';
import { PermanentUploadError } from '../../../../domain/upload/errors/PermanentUploadError';

describe('RateLimitDecoratingTARSUploader', () => {
  let rateLimitingUploader: RateLimitDecoratingTARSUploader;
  let recordingUploader: RecordingTARSUploader;
  const rateLimitingConfig: ITARSRateLimiterConfig = {
    maxRetries: 2,
    requestsPerSecond: 1,
  };

  const dummyPayload: ITARSPayload = {
    applicationId: 123,
    bookingSequence: 1,
  };

  beforeEach(() => {
    recordingUploader = new RecordingTARSUploader();
    rateLimitingUploader = new RateLimitDecoratingTARSUploader(recordingUploader, rateLimitingConfig);
  });

  describe('retries', () => {
    it('shouldnt retry where the upload is successful', async () => {
      await rateLimitingUploader.uploadToTARS(dummyPayload, TARSInterfaceType.COMPLETED);

      expect(recordingUploader.getCalls().length).toBe(1);
    });

    it('should retry TransientUploadErrors to achieve a successful upload', async () => {
      recordingUploader.rejectWithErrorOnNextNCalls(new TransientUploadError('502'), 1);

      await rateLimitingUploader.uploadToTARS(dummyPayload, TARSInterfaceType.COMPLETED);

      expect(recordingUploader.getCalls().length).toBe(2);
    });

    it('should stop retrying when it encounters a PermanentUploadError', async () => {
      recordingUploader.rejectWithErrorOnNextNCalls(new TransientUploadError('502'), 1);
      recordingUploader.rejectWithErrorOnNextNCalls(new PermanentUploadError('400'), 1);

      try {
        await rateLimitingUploader.uploadToTARS(dummyPayload, TARSInterfaceType.COMPLETED);
      } catch (err) {
        expect(recordingUploader.getCalls().length).toBe(2);
        return;
      }
      fail();
    });

    it('should throw the underlying error once retries have been exhausted', async () => {
      recordingUploader.rejectWithErrorOnNextNCalls(new TransientUploadError('502'), 3);

      try {
        await rateLimitingUploader.uploadToTARS(dummyPayload, TARSInterfaceType.COMPLETED);
      } catch (err) {
        expect(recordingUploader.getCalls().length).toBe(3);
        return;
      }
      fail();
    });
  });
});
