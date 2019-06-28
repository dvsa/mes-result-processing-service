export interface MetricSpecification {
  name: string;
  description: string;
}

export enum Metric {
  ResultUploadSuccesses = 'ResultUploadSuccesses',
  ResultUploadFailures = 'ResultUploadFailures',
  BatchCompletedTests = 'BatchCompletedTests',
  BatchNonCompletedTests = 'BatchNonCompletedTests',
}

export const lookupMetricSpecification = (metric: Metric): MetricSpecification => {
  const name = metric.valueOf();
  switch (metric) {
    case Metric.ResultUploadSuccesses:
      return { name, description: 'How many test results were successfully uploaded to TARS' };
    case Metric.ResultUploadFailures:
      return { name, description: 'How many test results failed to be submitted to TARS' };
    case Metric.BatchCompletedTests:
      return { name, description: 'How many tests in the batch were completed tests' };
    case Metric.BatchNonCompletedTests:
      return { name, description: 'How many tests in the batch were non-completed tests' };
    default:
      return { name: 'unknown', description: 'unknown' };
  }
};
