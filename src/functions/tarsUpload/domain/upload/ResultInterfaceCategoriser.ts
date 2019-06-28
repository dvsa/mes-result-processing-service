import { injectable, inject } from 'inversify';
import { IResultInterfaceCategoriser } from './IResultInterfaceCategoriser';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TestsByInterface } from './TestsByInterface';
import { TYPES } from '../../framework/di/types';
import { IMetricSubmitter } from '../../application/secondary/IMetricSubmitter';
import { Metric } from '../util/Metrics';

@injectable()
export class ResultInterfaceCategoriser implements IResultInterfaceCategoriser {

  constructor(
    @inject(TYPES.MetricSubmitter) private metricSubmitter: IMetricSubmitter,
  ) { }

  categoriseByInterface(batch: StandardCarTestCATBSchema[]): TestsByInterface {
    const categories = batch.reduce((categories, test) => {
      return this.isCompletedTest(test) ?
        { ...categories, completed: [...categories.completed, test] } :
        { ...categories, nonCompleted: [...categories.nonCompleted, test] };
      // tslint:disable-next-line:align
    }, { completed: [], nonCompleted: [] } as TestsByInterface);

    this.metricSubmitter.submitMetric(Metric.BatchCompletedTests, categories.completed.length);
    this.metricSubmitter.submitMetric(Metric.BatchNonCompletedTests, categories.nonCompleted.length);

    return categories;
  }

  private isCompletedTest(test: StandardCarTestCATBSchema) {
    const completedActivityCodes = ['1', '2', '3', '4', '5'];
    return completedActivityCodes.includes(test.activityCode);
  }

}
