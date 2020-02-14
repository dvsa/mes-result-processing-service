import { convertDl25TestCategory } from '../TestCategoryConvertor';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

describe('convertDl25TestCategory', () => {

  describe('EU prefixed category codes', () => {
    const catATestCases = [
      { category: 'EUA1M1' as CategoryCode, expected: 'A1M1' },
      { category: 'EUA1M2' as CategoryCode, expected: 'A1M2' },
      { category: 'EUA2M1' as CategoryCode, expected: 'A2M1' },
      { category: 'EUA2M2' as CategoryCode, expected: 'A2M2' },
      { category: 'EUAM1' as CategoryCode, expected: 'AM1' },
      { category: 'EUAM2' as CategoryCode, expected: 'AM2' },
      { category: 'EUAMM1' as CategoryCode, expected: 'AMM1' },
      { category: 'EUAMM2' as CategoryCode, expected: 'AMM2' },
    ];

    catATestCases.forEach((test) => {
      it(`should return DL25 test category ${test.expected} for category ${test.category}`, () => {
        expect(convertDl25TestCategory(test.category)).toBe(test.expected);
      });
    });

  });

  describe('non EU prefixed category codes', () => {
    const nonCatATestCases = [
      { category: 'A' as CategoryCode, expected: 'A' },
      { category: 'A1' as CategoryCode, expected: 'A1' },
      { category: 'A2' as CategoryCode, expected: 'A2' },
      { category: 'ADI2' as CategoryCode, expected: 'ADI2' },
      { category: 'ADI3' as CategoryCode, expected: 'ADI3' },
      { category: 'AM' as CategoryCode, expected: 'AM' },
      { category: 'B' as CategoryCode, expected: 'B' },
      { category: 'B1' as CategoryCode, expected: 'B1' },
      { category: 'B+E' as CategoryCode, expected: 'B+E' },
      { category: 'C' as CategoryCode, expected: 'C' },
      { category: 'C1' as CategoryCode, expected: 'C1' },
      { category: 'C1+E' as CategoryCode, expected: 'C1+E' },
      { category: 'CCPC' as CategoryCode, expected: 'CCPC' },
      { category: 'C+E' as CategoryCode, expected: 'C+E' },
      { category: 'D' as CategoryCode, expected: 'D' },
      { category: 'D1' as CategoryCode, expected: 'D1' },
      { category: 'D1+E' as CategoryCode, expected: 'D1+E' },
      { category: 'DCPC' as CategoryCode, expected: 'DCPC' },
      { category: 'D+E' as CategoryCode, expected: 'D+E' },
    ];

    nonCatATestCases.forEach((test) => {
      it(`should return unmodified category code if category is ${test.category}`, () => {
        expect(convertDl25TestCategory(test.category)).toBe(test.expected);
      });
    });

  });

});
