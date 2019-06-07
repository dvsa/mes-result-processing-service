import { injectable } from 'inversify';
import { ITarsUploadFacade } from './ITarsUploadFacade';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSInterfaceType } from './TARSInterfaceType';
import { TARSUploadResult } from './TARSUploadResult';
import { TARSUploadStatus } from './TARSUploadStatus';

@injectable()
export class TARSUploadFacade implements ITarsUploadFacade {
  upload(test: StandardCarTestCATBSchema, intefaceType: TARSInterfaceType): Promise<TARSUploadResult[]> {
    console.log(`Uploading ${JSON.stringify(test)}`);
    return Promise.resolve([{ test, status: TARSUploadStatus.SUCCESSFUL }]);
  }
}
