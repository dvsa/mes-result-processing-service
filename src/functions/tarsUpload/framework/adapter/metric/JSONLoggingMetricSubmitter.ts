import { IMetricSubmitter } from '../../../application/secondary/IMetricSubmitter';
import { Metric, lookupMetricSpecification, MetricSpecification } from '../../../domain/util/Metrics';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { ILogger } from '../../../domain/util/ILogger';

export interface MetricInstance extends MetricSpecification {
  service: string;
  value: any;
}

@injectable()
export class JSONLoggingMetricSubmitter implements IMetricSubmitter {

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
  ) { }

  submitMetric(metric: Metric, value: any): void {
    const metricSpec = lookupMetricSpecification(metric);
    const metricInstance: MetricInstance = {
      value,
      ...metricSpec,
      service: 'result-processing-service',
    };
    this.logger.metric(JSON.stringify(metricInstance));
  }

}
