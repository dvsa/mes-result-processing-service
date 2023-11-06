import {SuccessfulStubbingTARSUploader} from '../SuccessfulStubbingTARSUploader';
import {ILogger} from '../../../../domain/util/ILogger';
import {ITARSPayload} from '../../../../domain/upload/ITARSPayload';
import {TARSInterfaceType} from '../../../../domain/upload/TARSInterfaceType';

describe('SuccessfulStubbingTARSUploader', () => {
  let uploader: SuccessfulStubbingTARSUploader;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj('ILogger', ['info']);
    uploader = new SuccessfulStubbingTARSUploader(mockLogger);
  });

  it('should log the correct message and resolve with 0 when uploadToTARS is called', async () => {
    // Arrange
    const tarsPayload = {} as ITARSPayload;
    const interfaceType: TARSInterfaceType = TARSInterfaceType.COMPLETED;

    // Act
    const uploadPromise = uploader.uploadToTARS(tarsPayload, interfaceType);

    // Assert
    await expectAsync(uploadPromise).toBeResolvedTo(0);
    expect(mockLogger.info).toHaveBeenCalledWith(jasmine.stringMatching('In-memory TARS stub called at'));
  });
});
