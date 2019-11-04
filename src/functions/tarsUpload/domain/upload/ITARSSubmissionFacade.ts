import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { TARSUploadResult } from './TARSUploadResult';
import { TARSInterfaceType } from './TARSInterfaceType';

export interface ITARSSubmissionFacade {
  convertAndUpload(tests: CatBUniqueTypes.TestResult, intefaceType: TARSInterfaceType): Promise<TARSUploadResult>;
}
