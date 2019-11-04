import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TARSUploadResult } from './TARSUploadResult';
import { TARSInterfaceType } from './TARSInterfaceType';

export interface ITARSSubmissionFacade {
  convertAndUpload(tests: TestResultSchemasUnion, intefaceType: TARSInterfaceType): Promise<TARSUploadResult>;
}
