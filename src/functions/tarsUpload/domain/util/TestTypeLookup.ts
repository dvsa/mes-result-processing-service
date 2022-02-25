export const determineDl25TestType = (category: string): number | undefined => {
  // DL25 test category to test type mapping, as per the TARS TEST_CATEGORY_CROSS_REFERENCE table,
  // documented at https://wiki.i-env.net/display/MES/Test+Category+Cross+Reference and agreed with DVSA MI Team.
  const mapping: Map<string, number> = new Map([
    ['ADI2', 10],
    ['B', 2], ['B+E', 2],
    ['C', 3], ['C+E', 3], ['C1', 3], ['C1+E', 3],
    ['D', 4], ['D+E', 4], ['D1', 4], ['D1+E', 4],
    ['F', 5],
    ['G', 6],
    ['H', 7],
    ['K', 8],
    // Note that some extra data will be needed in MES to identify CPC tests, if MES adds support for them...
    // LGV (Lorry) CPC (all C Categories) => 44
    // PCV (Bus) CPC (all D Categories) => 44
    ['EUA1M1', 16], ['EUA1M2', 1],
    ['EUA2M1', 16], ['EUA2M2', 1],
    ['EUAM1', 16], ['EUAM2', 1],
    ['EUAMM1', 17], ['EUAMM2', 9],
    ['CCPC', 44], ['DCPC', 44],
    // manoeuvre catgeories
    ['CM', 18], ['C+EM', 18], ['C1M', 18], ['C1+EM', 18],
    ['DM', 19], ['D+EM', 19], ['D1M', 19], ['D1+EM', 19],
  ]);
  const testType = mapping.get(category);
  return testType;
};
