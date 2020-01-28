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
       ['A1M1', 16], ['A1M2', 1],
       ['A2M1', 16], ['A2M2', 1],
       ['AM1', 16], ['AM2', 1],
       ['AMM1', 17], ['AMM2', 9],
  ]);
  const testType = mapping.get(category);
  return testType;
};
