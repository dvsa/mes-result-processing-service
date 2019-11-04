import { ISubmissionReportingMediator } from './ISubmissionReportingMediator';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { injectable, inject } from 'inversify';
import { TYPES } from '../framework/di/types';
import { IResultInterfaceCategoriser } from './upload/IResultInterfaceCategoriser';
import { ITARSSubmissionFacade } from './upload/ITARSSubmissionFacade';
import { TARSInterfaceType } from './upload/TARSInterfaceType';
import { ISubmissionOutcomeReporter } from './reporting/ISubmissionOutcomeReporter';
import { ILogger } from './util/ILogger';
import { IMetricSubmitter } from '../application/secondary/IMetricSubmitter';
import { TARSUploadResult } from './upload/TARSUploadResult';
import { ProcessingStatus } from './reporting/ProcessingStatus';
import { Metric } from './util/Metrics';

@injectable()
export class SubmissionReportingMediator implements ISubmissionReportingMediator {
  constructor(
    @inject(TYPES.ResultInterfaceCategoriser) private resultInterfaceCategoriser: IResultInterfaceCategoriser,
    @inject(TYPES.TARSSubmissionFacade) private tarsSubmissionFacade: ITARSSubmissionFacade,
    @inject(TYPES.SubmissionOutcomeReporter) private submissionOutcomeReporter: ISubmissionOutcomeReporter,
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.MetricSubmitter) private metricSubmitter: IMetricSubmitter,
  ) { }

  async submitBatchesAndReportOutcome(batch: TestResultSchemasUnion[]): Promise<void> {
    const { completed, nonCompleted } = this.resultInterfaceCategoriser.categoriseByInterface(batch);
    try {
      const uploadResults = await Promise.all([
        ...this.submitAndReportCompletedTests(completed),
        ...this.submitAndReportNonCompletedTests(nonCompleted),
      ]);
      this.emitMetricsForUploadResults(uploadResults);
    } catch (err) {
      this.logger.error(`Failure reporting upload statuses, terminating: ${err.message}`);
    }
  }

  private submitAndReportCompletedTests(completedTests: TestResultSchemasUnion[]) {
    return completedTests.map(async (completedTest) => {
      const uploadResult = await this.tarsSubmissionFacade.convertAndUpload(completedTest, TARSInterfaceType.COMPLETED);
      await this.submissionOutcomeReporter.reportSubmissionOutcome(uploadResult);
      return uploadResult;
    });
  }

  private submitAndReportNonCompletedTests(nonCompletedTests: TestResultSchemasUnion[]) {
    return nonCompletedTests.map(async (nonCompletedTest) => {
      const uploadResult = await this.tarsSubmissionFacade.convertAndUpload(
        nonCompletedTest,
        TARSInterfaceType.NON_COMPLETED,
      );
      await this.submissionOutcomeReporter.reportSubmissionOutcome(uploadResult);
      return uploadResult;
    });
  }

  private emitMetricsForUploadResults(uploadResults: TARSUploadResult[]) {
    const successfulUploadCount = uploadResults.filter(result => result.status === ProcessingStatus.ACCEPTED).length;
    const unsuccessfulUploadCount = uploadResults.length - successfulUploadCount;
    this.metricSubmitter.submitMetric(Metric.ResultUploadSuccesses, successfulUploadCount);
    this.metricSubmitter.submitMetric(Metric.ResultUploadFailures, unsuccessfulUploadCount);
  }

}
