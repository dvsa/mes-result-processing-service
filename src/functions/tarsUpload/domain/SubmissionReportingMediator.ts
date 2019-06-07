import { ISubmissionReportingMediator } from './ISubmissionReportingMediator';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { injectable, inject } from 'inversify';
import { TYPES } from '../framework/di/types';
import { IResultInterfaceCategoriser } from './upload/IResultInterfaceCategoriser';

@injectable()
export class SubmissionReportingMediator implements ISubmissionReportingMediator {
  constructor(
    @inject(TYPES.ResultInterfaceCategoriser) private resultInterfaceCategoriser: IResultInterfaceCategoriser,
  ) { }

  async submitBatchesAndReportOutcome(batch: StandardCarTestCATBSchema[]): Promise<void> {
    console.log(`submitting and reporting on ${batch.length} results in an interleaved fashion`);
    const interfaceCategorisedResults = this.resultInterfaceCategoriser.categoriseByInterface(batch);
  }
}
