import { ISubmissionReportingMediator } from './ISubmissionReportingMediator';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { injectable, inject } from 'inversify';
import { TYPES } from '../framework/di/types';
import { IResultInterfaceCategoriser } from './upload/IResultInterfaceCategoriser';
import { ITarsUploadFacade } from './upload/ITarsUploadFacade';
import { TARSInterfaceType } from './upload/TARSInterfaceType';
import { TARSUploadStatus } from './upload/TARSUploadStatus';

@injectable()
export class SubmissionReportingMediator implements ISubmissionReportingMediator {
  constructor(
    @inject(TYPES.ResultInterfaceCategoriser) private resultInterfaceCategoriser: IResultInterfaceCategoriser,
    @inject(TYPES.TarsUploadFacade) private tarsUploadFacade: ITarsUploadFacade,
  ) { }

  async submitBatchesAndReportOutcome(batch: StandardCarTestCATBSchema[]): Promise<void> {
    console.log(`submitting and reporting on ${batch.length} results in an interleaved fashion`);
    const { completed, nonCompleted } = this.resultInterfaceCategoriser.categoriseByInterface(batch);

    await Promise.all([
      this.submitAndReportCompletedTests(completed),
      this.submitAndReportNonCompletedTests(nonCompleted),
    ]);
  }

  private submitAndReportCompletedTests(completedTests: StandardCarTestCATBSchema[]) {
    return Promise.all([
      completedTests.map((completedTest) => {
        this.tarsUploadFacade.upload(completedTest, TARSInterfaceType.COMPLETED)
          .then(() => {
            console.log('reporting completed');
          });
      }),
    ]);
  }

  private submitAndReportNonCompletedTests(nonCompletedTests: StandardCarTestCATBSchema[]) {
    return Promise.all([
      nonCompletedTests.map((nonCompletedTest) => {
        this.tarsUploadFacade.upload(nonCompletedTest, TARSInterfaceType.UNCOMPLETED)
          .then(() => {
            console.log('reporting completed');
          });
      }),
    ]);

  }
}
