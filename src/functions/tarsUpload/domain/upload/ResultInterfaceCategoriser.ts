import { injectable, inject } from 'inversify';
import { IResultInterfaceCategoriser } from './IResultInterfaceCategoriser';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestsByInterface } from './TestsByInterface';
import { TYPES } from '../../framework/di/types';
import { IMetricSubmitter } from '../../application/secondary/IMetricSubmitter';
import { Metric } from '../util/Metrics';

@injectable()
export class ResultInterfaceCategoriser implements IResultInterfaceCategoriser {

  constructor(
    @inject(TYPES.MetricSubmitter) private metricSubmitter: IMetricSubmitter,
  ) { }

  categoriseByInterface(batch: TestResultSchemasUnion[]): TestsByInterface {
    const categories = batch.reduce((categories, test) => {
      return this.isCompletedTest(test) ?
        { ...categories, completed: [...categories.completed, test] } :
        { ...categories, nonCompleted: [...categories.nonCompleted, test] };
      // tslint:disable-next-line:align
    }, { completed: [], nonCompleted: [] } as TestsByInterface);

    this.metricSubmitter.submitMetric(Metric.UploadBatchCompletedTests, categories.completed.length);
    this.metricSubmitter.submitMetric(Metric.UploadBatchNonCompletedTests, categories.nonCompleted.length);

    return categories;
  }

  private isCompletedTest(test: TestResultSchemasUnion) {
    const completedActivityCodes = ['1', '2', '3', '4', '5'];
    return completedActivityCodes.includes(test.activityCode);
  }

}
