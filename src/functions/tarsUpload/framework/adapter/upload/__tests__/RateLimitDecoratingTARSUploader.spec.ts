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
    requestsPerSecond: 2,
  };

  const dummyPayload: ITARSPayload = {
    applicationId: 123,
    bookingSequence: 1,
  };
  const dummyPayloadWithApplicationId = (applicationId: number): ITARSPayload => ({
    applicationId,
    bookingSequence: 1,
  });

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

  describe('rate limiting', () => {
    // Predicate for whether a timing is "close enough" to what we expect.
    const nearTo = (num1: number, num2: number) => Math.abs(num1 - num2) < 75;
    const approxInstantly = nearTo.bind(null, 0);
    const approxOneSecond = nearTo.bind(null, 1000);

    it('should rate limit calls to a configured number of requests per second', async () => {
      await Promise.all([
        rateLimitingUploader.uploadToTARS(dummyPayloadWithApplicationId(1), TARSInterfaceType.COMPLETED),
        rateLimitingUploader.uploadToTARS(dummyPayloadWithApplicationId(99), TARSInterfaceType.NON_COMPLETED),
        rateLimitingUploader.uploadToTARS(dummyPayloadWithApplicationId(2), TARSInterfaceType.COMPLETED),
        rateLimitingUploader.uploadToTARS(dummyPayloadWithApplicationId(3), TARSInterfaceType.COMPLETED),
        rateLimitingUploader.uploadToTARS(dummyPayloadWithApplicationId(4), TARSInterfaceType.COMPLETED),
        rateLimitingUploader.uploadToTARS(dummyPayloadWithApplicationId(5), TARSInterfaceType.COMPLETED),
        rateLimitingUploader.uploadToTARS(dummyPayloadWithApplicationId(6), TARSInterfaceType.COMPLETED),
      ]);

      const callTimings = recordingUploader.getCallMsTimings();

      expect(approxInstantly(callTimings[0])).toEqual(true); // Second call happened instantly (different interface)
      expect(approxInstantly(callTimings[1])).toEqual(true); // Third call happened instantly (rate limit allows it)
      expect(approxOneSecond(callTimings[2])).toEqual(true); // Fourth call was rate limited until ~1s after
      expect(approxInstantly(callTimings[3])).toEqual(true);
      expect(approxOneSecond(callTimings[4])).toEqual(true);
      expect(approxInstantly(callTimings[5])).toEqual(true);
    }, 10000); // custom timeout, should be heavily overestimated
  });
});
