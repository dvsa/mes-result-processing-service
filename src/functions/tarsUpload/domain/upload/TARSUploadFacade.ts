import { injectable } from 'inversify';
import { ITarsUploadFacade } from './ITarsUploadFacade';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSInterfaceType } from './TARSInterfaceType';
import { TARSUploadResult } from './TARSUploadResult';

@injectable()
export class TARSUploadFacade implements ITarsUploadFacade {
  upload(tests: StandardCarTestCATBSchema, intefaceType: TARSInterfaceType): Promise<TARSUploadResult[]> {
    return Promise.resolve([]);
  }
}
