import { Metric } from '../../domain/util/Metrics';

export interface IMetricSubmitter {
  submitMetric(metric: Metric, value: any): void;
}
