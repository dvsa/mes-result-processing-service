import { ITARSUploader } from '../../../application/secondary/ITARSUploader';
import { TARSInterfaceType } from '../../../domain/upload/TARSInterfaceType';
import { ITARSPayload } from '../../../domain/upload/ITARSPayload';
import { inject, injectable, named } from 'inversify';
import { TYPES } from '../../di/types';
import bottleneck from 'bottleneck';
import { UploadRetryCount } from '../../../domain/upload/UploadRetryCount';
import { ITARSRateLimiterConfig } from './ITARSRateLimiterConfig';
import { UploadFailureWithRetryCountError } from '../../../domain/upload/errors/UploadFailureWithRetryCountError';
import { TransientUploadError } from '../../../domain/upload/errors/TransientUploadError';

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
    this.completedLimiter = this.createRateLimiter();
    this.nonCompletedLimiter = this.createRateLimiter();
    this.setupRetryPolicy();
  }

  private createRateLimiter() {
    const { requestsPerSecond } = this.rateLimiterConfig;
    return new bottleneck({
      maxConcurrent: null,                       // No limit on concurrent requests
      minTime: 0,                                // No time waited between each request
      reservoir: requestsPerSecond,              // Amount of jobs the queue can perform at the start of the queue
      reservoirRefreshInterval: 1000,            // How often to add new jobs to the queue (every second)
      reservoirRefreshAmount: requestsPerSecond, // How many jobs to add to the queue each refresh
    });
  }

  private setupRetryPolicy() {
    this.setupRetryPolicyForInterfaceEndpoint(this.completedLimiter);
    this.setupRetryPolicyForInterfaceEndpoint(this.nonCompletedLimiter);
  }

  private setupRetryPolicyForInterfaceEndpoint(limiter: bottleneck) {
    const { maxRetries, requestsPerSecond } = this.rateLimiterConfig;
    // Trigger a retry in the case that we have retry attempts remaining on this upload
    limiter.on('failed', async (error, jobInfo) => {
      if (jobInfo.retryCount < maxRetries && error instanceof TransientUploadError) {
        return requestsPerSecond * 1000;
      }
    });
    // Track of the retry counts for given application IDs so uploadToTARS can return the count
    limiter.on('retry', (error, jobInfo) => {
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
