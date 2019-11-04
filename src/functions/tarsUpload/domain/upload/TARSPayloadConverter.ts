import { ITARSPayloadConverter } from './ITARSPayloadConverter';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { PassCompletion } from '@dvsa/mes-test-schema/categories/common';
import { TARSInterfaceType } from './TARSInterfaceType';
import { ITARSPayload } from './ITARSPayload';
import { injectable, inject } from 'inversify';
import { NonCompletedTestPayload } from './NonCompletedTest';
import { CompletedTestPayload } from './CompletedTestPayload';
import { TYPES } from '../../framework/di/types';
import { CompletedTestPayloadCreationError } from './errors/CompletedTestPayloadCreationError';
import { IDateFormatter } from '../util/IDateFormatter';

@injectable()
export class TARSPayloadConverter implements ITARSPayloadConverter {
  constructor(
    @inject(TYPES.DateFormatter) private dateFormatter: IDateFormatter,
  ) { }

  convertToTARSPayload(test: TestResultSchemasUnion, interfaceType: TARSInterfaceType): ITARSPayload {
    return interfaceType === TARSInterfaceType.COMPLETED ?
      this.convertToCompletedTestPayload(test) :
      this.convertToNonCompletedTestPayload(test);
  }

  convertToNonCompletedTestPayload(test: TestResultSchemasUnion): NonCompletedTestPayload {
    return {
      applicationId: test.journalData.applicationReference.applicationId,
      bookingSequence: test.journalData.applicationReference.bookingSequence,
      nonCompletionCode: Number.parseInt(test.activityCode, 0),
    };
  }

  convertToCompletedTestPayload(test: TestResultSchemasUnion): CompletedTestPayload {
    const { journalData, communicationPreferences, passCompletion, category, vehicleDetails, testSummary } = test;
    const { applicationReference, testSlotAttributes, candidate } = journalData;
    const { applicationId, bookingSequence, checkDigit } = applicationReference;
    if (
      !communicationPreferences ||
      !candidate.driverNumber ||
      !testSummary ||
      testSummary.D255 === undefined ||
      !vehicleDetails
    ) {
      throw new CompletedTestPayloadCreationError(test);
    }
    let completedTestPayload: CompletedTestPayload = {
      applicationId,
      bookingSequence,
      checkDigit,
      language: communicationPreferences.conductedLanguage === 'English' ? 'E' : 'W',
      licenceSurrender: passCompletion ? passCompletion.provisionalLicenceProvided : false,
      dl25Category: category,
      dl25TestType: 2, // TODO: 2 is for cat B only, we need to get this from the test schema eventually
      automaticTest: vehicleDetails.gearboxCategory === 'Automatic',
      extendedTest: testSlotAttributes.extendedTest,
      d255Selected: testSummary.D255,
      passResult: test.activityCode === '1',
      driverNumber: candidate.driverNumber,
      testDate: this.dateFormatter.asSlashDelimitedDate(new Date(testSlotAttributes.start)),
    };
    completedTestPayload = this.populatePassCertificateIfPresent(completedTestPayload, passCompletion);
    return completedTestPayload;
  }

  private populatePassCertificateIfPresent(
    completedTestPayload: CompletedTestPayload,
    passCompletion: PassCompletion | undefined,
  ): CompletedTestPayload {
    if (!passCompletion) {
      return completedTestPayload;
    }
    return {
      ...completedTestPayload,
      passCertificate: passCompletion.passCertificateNumber,
    };
  }

}
