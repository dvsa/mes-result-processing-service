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
        { category: 'EUA1M1', expected: 16 },
        { category: 'EUA1M2', expected: 1 },
        { category: 'EUA2M1', expected: 16 },
        { category: 'EUA2M2', expected: 1 },
        { category: 'EUAM1', expected: 16 },
        { category: 'EUAM2', expected: 1 },
        { category: 'EUAMM1', expected: 17 },
        { category: 'EUAMM2', expected: 9 },
        { category: 'CCPC', expected: 44 },
        { category: 'DCPC', expected: 44 },
        { category: 'CM', expected: 18 },
        { category: 'C+EM', expected: 18 },
        { category: 'C1M', expected: 18 },
        { category: 'C1+EM', expected: 18 },
        { category: 'DM', expected: 19 },
        { category: 'D+EM', expected: 19 },
        { category: 'D1M', expected: 19 },
        { category: 'D1+EM', expected: 19 },
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
