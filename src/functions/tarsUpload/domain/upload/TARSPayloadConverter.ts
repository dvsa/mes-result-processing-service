import { ITARSPayloadConverter } from './ITARSPayloadConverter';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TARSInterfaceType } from './TARSInterfaceType';
import { ITARSPayload } from './ITARSPayload';
import { injectable } from 'inversify';
import { NonCompletedTestPayload } from './NonCompletedTest';
import { CompletedTestPayload } from './CompletedTestPayload';

@injectable()
export class TARSPayloadConverter implements ITARSPayloadConverter {
  convertToTARSSubmission(test: StandardCarTestCATBSchema, interfaceType: TARSInterfaceType): ITARSPayload {
    console.log(`converting ${JSON.stringify(test)} to TARS payload`);
    return interfaceType === TARSInterfaceType.COMPLETED ?
      this.convertToCompletedTestPayload(test) :
      this.convertToNonCompletedTestPayload(test);
  }

  convertToCompletedTestPayload(test: StandardCarTestCATBSchema): NonCompletedTestPayload {
    return {
      applicationId: test.journalData.applicationReference.applicationId,
      bookingSequence: test.journalData.applicationReference.bookingSequence,
      nonCompletionCode: Number.parseInt(test.activityCode, 0),
    };
  }

  convertToNonCompletedTestPayload(test: StandardCarTestCATBSchema): CompletedTestPayload {
    const { journalData } = test;
    return {
      applicationId: journalData.applicationReference.applicationId,
      bookingSequence: journalData.applicationReference.bookingSequence,
      checkDigit: journalData.applicationReference.checkDigit,
      languageId: (test.communicationPreferences && test.communicationPreferences.conductedLanguage) || 'English',
      licenceSurrender: false,
      dL25Category: 'dl25cat',
      dL25TestType: 1,
      automaticTest: false,
      extendedTest: false,
      d255Selected: false,
      passResult: false,
      driverNumber: 'dn',
      testDate: '01/01/1970',
      passCertificate: 'certnum',
    };
  }

}
