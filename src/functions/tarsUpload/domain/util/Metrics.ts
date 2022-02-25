export interface MetricSpecification {
  name: string;
  description: string;
}

export enum Metric {
  UploadBatchCompletedTests = 'UploadBatchCompletedTests',
  UploadBatchNonCompletedTests = 'UploadBatchNonCompletedTests',
  ResultUploadSuccesses = 'ResultUploadSuccesses',
  ResultUploadFailures = 'ResultUploadFailures',
}

export const lookupMetricSpecification = (metric: Metric): MetricSpecification => {
  const name = metric.valueOf();
  switch (metric) {
  case Metric.UploadBatchCompletedTests:
    return { name, description: 'How many tests in the batch were completed tests' };
  case Metric.UploadBatchNonCompletedTests:
    return { name, description: 'How many tests in the batch were non-completed tests' };
  case Metric.ResultUploadSuccesses:
    return { name, description: 'How many test results were successfully uploaded to TARS' };
  case Metric.ResultUploadFailures:
    return { name, description: 'How many test results failed to be submitted to TARS' };
  default:
    return { name: 'unknown', description: 'unknown' };
  }
};
