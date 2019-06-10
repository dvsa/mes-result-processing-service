import { ISubmissionReportingMediator } from './ISubmissionReportingMediator';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { injectable, inject } from 'inversify';
import { TYPES } from '../framework/di/types';
import { IResultInterfaceCategoriser } from './upload/IResultInterfaceCategoriser';
import { ITARSSubmissionFacade } from './upload/ITARSSubmissionFacade';
import { TARSInterfaceType } from './upload/TARSInterfaceType';

@injectable()
export class SubmissionReportingMediator implements ISubmissionReportingMediator {
  constructor(
    @inject(TYPES.ResultInterfaceCategoriser) private resultInterfaceCategoriser: IResultInterfaceCategoriser,
    @inject(TYPES.TARSSubmissionFacade) private tarsUploadFacade: ITARSSubmissionFacade,
  ) { }

  async submitBatchesAndReportOutcome(batch: StandardCarTestCATBSchema[]): Promise<void> {
    console.log(`submitting and reporting on ${batch.length} results in an interleaved fashion`);
    const { completed, nonCompleted } = this.resultInterfaceCategoriser.categoriseByInterface(batch);

    await Promise.all([
      this.submitAndReportCompletedTests(completed),
      this.submitAndReportNonCompletedTests(nonCompleted),
    ]);
  }

  // TODO: We can't directly map all of these to an upload, rate limiting will need to come here
  private submitAndReportCompletedTests(completedTests: StandardCarTestCATBSchema[]) {
    return Promise.all([
      completedTests.map((completedTest) => {
        this.tarsUploadFacade.convertAndUpload(completedTest, TARSInterfaceType.COMPLETED)
          .then((uploadResult) => {
            console.log(`reporting completed uploads`);
          });
      }),
    ]);
  }

  // TODO: We can't directly map all of these to an upload, rate limiting will need to come here
  private submitAndReportNonCompletedTests(nonCompletedTests: StandardCarTestCATBSchema[]) {
    return Promise.all([
      nonCompletedTests.map((nonCompletedTest) => {
        this.tarsUploadFacade.convertAndUpload(nonCompletedTest, TARSInterfaceType.UNCOMPLETED)
          .then((uploadResult) => {
            console.log(`reporting noncompleted uploads`);
          });
      }),
    ]);

  }
}
