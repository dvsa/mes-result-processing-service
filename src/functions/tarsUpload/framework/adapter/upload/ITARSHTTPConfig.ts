export interface ITARSHTTPConfig {
  maxRetriesPerUpload: number;
  completedTestEndpoint: string;
  nonCompletedTestEndpoint: string;
  requestTimeoutMs: number;
}
