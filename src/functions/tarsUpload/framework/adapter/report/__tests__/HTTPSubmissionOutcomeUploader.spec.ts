import axios from 'axios';
import { Container } from 'inversify';
import {HTTPSubmissionOutcomeUploader} from '../HTTPSubmissionOutcomeUploader';
import {ILogger} from '../../../../domain/util/ILogger';
import {IOutcomeReportingHTTPConfig} from '../IOutcomeReportingHTTPConfig';
import {TYPES} from '../../../di/types';
import {SubmissionOutcomeContext} from '../../../../domain/reporting/SubmissionOutcomeContext';
import * as MockAdapter from 'axios-mock-adapter';

describe('HTTPSubmissionOutcomeUploader', () => {
  let uploader: HTTPSubmissionOutcomeUploader;
  let mockAxios: MockAdapter;
  let mockLogger: jasmine.SpyObj<ILogger>;
  let mockOutcomeReportingHTTPConfig: IOutcomeReportingHTTPConfig;

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj('ILogger', ['error']);
    mockOutcomeReportingHTTPConfig = {
      outcomeReportingURLTemplate: 'http://example.com/reporting/{app-ref}',
    };

    const container = new Container();
    container.bind<IOutcomeReportingHTTPConfig>(TYPES.OutcomeReportingHTTPConfig)
      .toConstantValue(mockOutcomeReportingHTTPConfig);
    container.bind<ILogger>(TYPES.Logger).toConstantValue(mockLogger);
    container.bind<HTTPSubmissionOutcomeUploader>(HTTPSubmissionOutcomeUploader).toSelf();

    uploader = container.resolve(HTTPSubmissionOutcomeUploader);

    const axiosInstance = axios.create();
    mockAxios = new MockAdapter(axiosInstance);
    uploader.axios = axiosInstance;
  });

  it('should resolve when the axios put request is successful', async () => {
    // Arrange
    const submissionOutcomeCtx = {
      applicationReference: 123,
      outcomePayload: { staff_number: '1234567' },
    } as SubmissionOutcomeContext;
    const putRequestUrl = `http://example.com/reporting/${submissionOutcomeCtx.applicationReference}`;

    mockAxios.onPut(putRequestUrl).reply(200);
    // Act
    await uploader.uploadSubmissionOutcome(submissionOutcomeCtx);

    // Assert
    await expectAsync(uploader.uploadSubmissionOutcome(submissionOutcomeCtx)).toBeResolved();
  });

  it('should reject with an UpdateUploadStatusError when the axios put request fails', async () => {
    // Arrange
    const submissionOutcomeCtx = {
      applicationReference: 123,
      outcomePayload: { staff_number: '1234567' },
    } as SubmissionOutcomeContext;

    const putRequestUrl = `http://example.com/reporting/${submissionOutcomeCtx.applicationReference}`;
    mockAxios.onPut(putRequestUrl).networkError();

    // Act & Assert
    await expectAsync(uploader.uploadSubmissionOutcome(submissionOutcomeCtx)).toBeRejected();
  });
});
