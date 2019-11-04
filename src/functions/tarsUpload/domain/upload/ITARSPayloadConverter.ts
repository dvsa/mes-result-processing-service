import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { ITARSPayload } from './ITARSPayload';
import { TARSInterfaceType } from './TARSInterfaceType';

export interface ITARSPayloadConverter {
  convertToTARSPayload(test: TestResultSchemasUnion, interfaceType: TARSInterfaceType): ITARSPayload;
}
