export interface ITestResultBatchProcessor {
  processNextBatch(): Promise<void>;
}
