import { ITARSPayloadConverter } from './ITARSPayloadConverter';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSInterfaceType } from './TARSInterfaceType';
import { ITARSPayload } from './ITARSPayload';
import { injectable, inject } from 'inversify';
import { NonCompletedTestPayload } from './NonCompletedTest';
import { CompletedTestPayload } from './CompletedTestPayload';
import { TYPES } from '../../framework/di/types';

@injectable()
export class TARSPayloadConverter implements ITARSPayloadConverter {
  convertToTARSSubmission(test: StandardCarTestCATBSchema, interfaceType: TARSInterfaceType): ITARSPayload {
    return interfaceType === TARSInterfaceType.COMPLETED ?
      this.convertToCompletedTestPayload(test) :
      this.convertToNonCompletedTestPayload(test);
  }

  convertToNonCompletedTestPayload(test: StandardCarTestCATBSchema): NonCompletedTestPayload {
    return {
      applicationId: test.journalData.applicationReference.applicationId,
      bookingSequence: test.journalData.applicationReference.bookingSequence,
      nonCompletionCode: Number.parseInt(test.activityCode, 0),
    };
  }

  convertToCompletedTestPayload(test: StandardCarTestCATBSchema): CompletedTestPayload {
    const { journalData, communicationPreferences, passCompletion, category, vehicleDetails } = test;
    const { applicationReference, testSlotAttributes, candidate } = journalData;
    const { applicationId, bookingSequence, checkDigit } = applicationReference;
    if (
      !passCompletion ||
      !communicationPreferences ||
      !candidate.driverNumber ||
      !test.testSummary ||
      !vehicleDetails
    ) {
      throw new Error(`Invalid completed test: ${JSON.stringify(test)}`);
    }
    return {
      applicationId,
      bookingSequence,
      checkDigit,
      languageId: communicationPreferences.conductedLanguage === 'English' ? 'E' : 'W',
      licenceSurrender: passCompletion.provisionalLicenceProvided,
      dL25Category: category,
      dL25TestType: 2, // TODO: 2 is for cat B only, we need to get this from the test schema eventually
      automaticTest: vehicleDetails.gearboxCategory === 'Automatic',
      extendedTest: testSlotAttributes.extendedTest,
      d255Selected: test.testSummary.d255Selected,
      passResult: test.activityCode === '1',
      driverNumber: candidate.driverNumber,
      testDate: new Date(testSlotAttributes.start).toLocaleDateString('en-GB'),
      passCertificate: passCompletion.passCertificateNumber,
    };
  }

}
