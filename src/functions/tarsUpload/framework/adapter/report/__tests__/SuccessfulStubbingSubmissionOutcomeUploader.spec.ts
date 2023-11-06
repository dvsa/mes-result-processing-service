import {SuccessfulStubbingSubmissionOutcomeUploader} from '../SuccessfulStubbingSubmissionOutcomeUploader';
import {ILogger} from '../../../../domain/util/ILogger';
import {SubmissionOutcomeContext} from '../../../../domain/reporting/SubmissionOutcomeContext';

describe('SuccessfulStubbingSubmissionOutcomeUploader', () => {
  let uploader: SuccessfulStubbingSubmissionOutcomeUploader;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj('ILogger', ['info']);
    uploader = new SuccessfulStubbingSubmissionOutcomeUploader(mockLogger);
  });

  it('should log the correct message and resolve when uploadSubmissionOutcome is called', async () => {
    // Arrange
    const submissionOutcomeCtx = {} as SubmissionOutcomeContext;

    // Act
    const uploadPromise = uploader.uploadSubmissionOutcome(submissionOutcomeCtx);

    // Assert
    await expectAsync(uploadPromise).toBeResolved();
    expect(mockLogger.info).toHaveBeenCalledWith(
      `In-memory submission outcome stub called with payload ${JSON.stringify(submissionOutcomeCtx)}`,
    );
  });
});
