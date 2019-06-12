import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import { inject, injectable, named } from 'inversify';
import { TYPES } from '../../di/types';
import bottleneck from 'bottleneck';
import { UploadRetryCount } from '../../../domain/upload/UploadRetryCount';
import { ITARSRateLimiterConfig } from './ITARSRateLimiterConfig';
import { UploadFailureWithRetryCountError } from '../../../domain/upload/errors/UploadFailureWithRetryCountError';

@injectable()
export class RateLimitDecoratingTARSUploader implements ITARSUploader {

  // We meter against requests against the (non)completed APIs separately.
  private completedLimiter: bottleneck;
  private nonCompletedLimiter: bottleneck;

  private retryCountByApplicationId: { [applicationId: string]: number } = {};

  constructor(
    @inject(TYPES.TARSUploader) @named('http') private delegatedUploader: ITARSUploader,
    @inject(TYPES.TARSRateLimiterConfig) private rateLimiterConfig: ITARSRateLimiterConfig,
  ) {
    const { requestIntervalMs } = rateLimiterConfig;
    this.completedLimiter = new bottleneck({ minTime: requestIntervalMs });
    this.nonCompletedLimiter = new bottleneck({ minTime: requestIntervalMs });
    this.setupRetryPolicy();
  }

  private setupRetryPolicy() {
    const { maxRetries, requestIntervalMs } = this.rateLimiterConfig;
    // Trigger a retry in the case that we have retry attempts remaining on this upload
    this.nonCompletedLimiter.on('failed', async (error, jobInfo) => {
      if (jobInfo.retryCount < maxRetries) {
        return requestIntervalMs;
      }
    });
    // Track of the retry counts for given application IDs so uploadToTARS can return the count
    this.nonCompletedLimiter.on('retry', (error, jobInfo) => {
      const oldRetryCount = jobInfo.retryCount;
      this.retryCountByApplicationId = {
        ...this.retryCountByApplicationId,
        [jobInfo.options.id]: oldRetryCount + 1,
      };
    });
  }

  async uploadToTARS(tarsPayload: ITARSPayload, interfaceType: TARSInterfaceType): Promise<UploadRetryCount> {
    const { applicationId } = tarsPayload;
    try {
      const limiter = interfaceType === TARSInterfaceType.COMPLETED ? this.completedLimiter : this.nonCompletedLimiter;
      await limiter.schedule(
        { id: `${applicationId}` },
        () => this.delegatedUploader.uploadToTARS(tarsPayload, interfaceType),
      );
      return this.retryCountByApplicationId[applicationId] || 0;
    } catch (err) {
      throw new UploadFailureWithRetryCountError(err, this.retryCountByApplicationId[applicationId] || 0);
    }
  }

}
