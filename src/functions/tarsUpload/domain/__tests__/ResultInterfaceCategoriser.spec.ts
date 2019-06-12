import 'reflect-metadata';
import { IResultInterfaceCategoriser } from '../upload/IResultInterfaceCategoriser';
import { StandardCarTestCATBSchema, ActivityCode } from '@dvsa/mes-test-schema/categories/B';
import { ResultInterfaceCategoriser } from '../upload/ResultInterfaceCategoriser';
import { dummyTests } from './__data__/DummyTests';
import { TestsByInterface } from '../upload/TestsByInterface';
import { container } from '../../framework/di/inversify.config';
import { TYPES } from '../../framework/di/types';

describe('ResultInterfaceCategoriser', () => {
  let categoriser: IResultInterfaceCategoriser;
  let batch: StandardCarTestCATBSchema[];
  let expectedResult: TestsByInterface;

  beforeEach(() => {
    categoriser = container.get<IResultInterfaceCategoriser>(TYPES.ResultInterfaceCategoriser);
    batch = [];
    expectedResult = { completed: [], nonCompleted: [] };
  });

  it('should be able to handle empty batch', () => {
    const result = categoriser.categoriseByInterface(batch);
    expect(result).toEqual(expectedResult);
  });

  it('should be able to correctly categorise tests based on their activity codes', () => {
    batch = [dummyTests.pass1, dummyTests.fail1];
    expectedResult.completed.push(dummyTests.pass1);
    expectedResult.nonCompleted.push(dummyTests.fail1);

    const result = categoriser.categoriseByInterface(batch);
    expect(result).toEqual(expectedResult);
  });

  it('should classify all tests with activity code between 1 and 5 as completed', () => {
    ['1', '2', '3', '4', '5', '6'].forEach((activityCode) => {
      const test = Object.assign({}, dummyTests.pass1);
      test.activityCode = activityCode as ActivityCode;
      batch.push(test);
    });

    const result = categoriser.categoriseByInterface(batch);
    expect(result.completed.length).toEqual(5);
    expect(result.nonCompleted.length).toEqual(1);
  });
});
