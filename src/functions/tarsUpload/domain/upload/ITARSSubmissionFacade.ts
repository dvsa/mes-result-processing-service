import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSUploadResult } from './TARSUploadResult';
import { TARSInterfaceType } from './TARSInterfaceType';

export interface ITARSSubmissionFacade {
  convertAndUpload(tests: StandardCarTestCATBSchema, intefaceType: TARSInterfaceType): Promise<TARSUploadResult>;
}
