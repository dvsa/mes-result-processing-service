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
    @inject(TYPES.TARSSubmissionFacade) private tarsSubmissionFacade: ITARSSubmissionFacade,
  ) { }

  async submitBatchesAndReportOutcome(batch: StandardCarTestCATBSchema[]): Promise<void> {
    const { completed, nonCompleted } = this.resultInterfaceCategoriser.categoriseByInterface(batch);
    await Promise.all([
      ...this.submitAndReportCompletedTests(completed),
      ...this.submitAndReportNonCompletedTests(nonCompleted),
    ]);
  }

  private submitAndReportCompletedTests(completedTests: StandardCarTestCATBSchema[]) {
    return completedTests.map((completedTest) => {
      return this.tarsSubmissionFacade.convertAndUpload(completedTest, TARSInterfaceType.COMPLETED)
        .then((uploadResult) => {
          console.log(`reporting completed upload`);
        });
    });
  }

  private submitAndReportNonCompletedTests(nonCompletedTests: StandardCarTestCATBSchema[]) {
    return nonCompletedTests.map((nonCompletedTest) => {
      return this.tarsSubmissionFacade.convertAndUpload(nonCompletedTest, TARSInterfaceType.NON_COMPLETED)
        .then((uploadResult) => {
          console.log(`reporting noncompleted upload`);
        });
    });
  }

}
