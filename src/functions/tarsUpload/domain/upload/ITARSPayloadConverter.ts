import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { ITARSPayload } from './ITARSPayload';
import { TARSInterfaceType } from './TARSInterfaceType';

export interface ITARSPayloadConverter {
  convertToTARSPayload(test: StandardCarTestCATBSchema, interfaceType: TARSInterfaceType): ITARSPayload;
}