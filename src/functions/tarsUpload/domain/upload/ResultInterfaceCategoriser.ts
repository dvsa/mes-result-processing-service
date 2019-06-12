import { injectable } from 'inversify';
import { IResultInterfaceCategoriser } from './IResultInterfaceCategoriser';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TestsByInterface } from './TestsByInterface';

@injectable()
export class ResultInterfaceCategoriser implements IResultInterfaceCategoriser {
  categoriseByInterface(batch: StandardCarTestCATBSchema[]): TestsByInterface {
    return batch.reduce((categories, test) => {
      return this.isCompletedTest(test) ?
        { ...categories, completed: [...categories.completed, test] } :
        { ...categories, nonCompleted: [...categories.nonCompleted, test] };
      // tslint:disable-next-line:align
    }, { completed: [], nonCompleted: [] } as TestsByInterface);
  }

  private isCompletedTest(test: StandardCarTestCATBSchema) {
    const completedActivityCodes = ['1', '2', '3', '4', '5'];
    return completedActivityCodes.includes(test.activityCode);
  }

}
