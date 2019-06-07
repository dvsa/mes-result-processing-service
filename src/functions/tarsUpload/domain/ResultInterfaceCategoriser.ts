import { injectable } from 'inversify';
import { IResultInterfaceCategoriser } from './upload/IResultInterfaceCategoriser';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TestsByInterface } from './upload/TestsByInterface';

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
    return ['1', '2'].includes(test.activityCode);
  }

}
