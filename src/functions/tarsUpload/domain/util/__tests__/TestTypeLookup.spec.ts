import { determineDl25TestType } from '../TestTypeLookup';

describe('determineDl25TestType', () => {
  const validCategoryTestCases = [
        { category: 'ADI2', expected: 10 },
        { category: 'B', expected: 2 },
        { category: 'B+E', expected: 2 },
        { category: 'C', expected: 3 },
        { category: 'C+E', expected: 3 },
        { category: 'C1', expected: 3 },
        { category: 'C1+E', expected: 3 },
        { category: 'D', expected: 4 },
        { category: 'D+E', expected: 4 },
        { category: 'D1', expected: 4 },
        { category: 'D1+E', expected: 4 },
        { category: 'F', expected: 5 },
        { category: 'G', expected: 6 },
        { category: 'H', expected: 7 },
        { category: 'K', expected: 8 },
        { category: 'A1M1', expected: 16 },
        { category: 'A1M2', expected: 1 },
        { category: 'A2M1', expected: 16 },
        { category: 'A2M2', expected: 1 },
        { category: 'AM1', expected: 16 },
        { category: 'AM2', expected: 1 },
        { category: 'AMM1', expected: 17 },
        { category: 'AMM2', expected: 9 },
  ];

  validCategoryTestCases.forEach((test) => {
    it(`should return test type ${test.expected} for valid category ${test.category}`, () => {
      expect(determineDl25TestType(test.category)).toBe(test.expected);
    });
  });
  it('should return undefined if category unrecognised', () => {
    expect(determineDl25TestType('X')).toBeUndefined();
  });
});