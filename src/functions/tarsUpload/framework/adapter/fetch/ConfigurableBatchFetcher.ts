import { IBatchFetcher } from '../../../application/secondary/IBatchFetcher';
import { injectable } from 'inversify';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

@injectable()
export class ConfigurableBatchFetcher implements IBatchFetcher {

  private nextBatch: StandardCarTestCATBSchema[] = [
    {
      category: 'B',
      id: 'xyz',
      journalData: {
        examiner: {
          staffNumber: '123',
        },
        testCentre: {
          centreId: 54321,
          costCode: 'EXTC1',
        },
        testSlotAttributes: {
          welshTest: false,
          slotId: 1005,
          start: '2019-06-07T12:38:00+01:00',
          vehicleSlotType: 'B57mins',
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {
          candidateAddress: {
            addressLine1: 'x Station Street',
            addressLine2: 'Someplace',
            addressLine3: 'Somearea',
            addressLine4: 'Somecity',
            postcode: 'UBxx xAA',
          },
          candidateId: 105,
          candidateName: {
            firstName: 'Ali',
            lastName: 'Campbell',
            title: 'Mr',
          },
          driverNumber: 'CAMPB805220A89HC',
          mobileTelephone: '07654 123456',
          primaryTelephone: '01234 567890',
        },
        applicationReference: {
          applicationId: 1234571,
          bookingSequence: 2,
          checkDigit: 6,
        },
      },
      preTestDeclarations: {
        insuranceDeclarationAccepted: false,
        residencyDeclarationAccepted: false,
        preTestSignature: '',
      },
      accompaniment: {},
      vehicleDetails: {
        registrationNumber: '',
      },
      instructorDetails: {},
      testData: {
        dangerousFaults: {},
        drivingFaults: {},
        manoeuvres: {},
        seriousFaults: {},
        testRequirements: {},
        ETA: {},
        eco: {},
        controlledStop: {},
        vehicleChecks: {
          tellMeQuestion: {},
          showMeQuestion: {},
        },
      },
      passCompletion: {
        provisionalLicenceProvided: true,
        passCertificateNumber: 'abc123',
      },
      postTestDeclarations: {
        healthDeclarationAccepted: false,
        passCertificateNumberReceived: false,
        postTestSignature: '',
      },
      testSummary: {
        weatherConditions: [],
        identification: 'Licence',
      },
      communicationPreferences: {
        updatedEmail: '',
        communicationMethod: 'Email',
        conductedLanguage: 'English',
      },
      activityCode: '51',
      eyesightTestResult: 'P',
    },
    {
      category: 'B',
      id: 'xyz',
      journalData: {
        examiner: {
          staffNumber: '123',
        },
        testCentre: {
          centreId: 54321,
          costCode: 'EXTC1',
        },
        testSlotAttributes: {
          welshTest: false,
          slotId: 1005,
          start: '2019-06-07T12:38:00+01:00',
          vehicleSlotType: 'B57mins',
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {
          candidateAddress: {
            addressLine1: 'x Station Street',
            addressLine2: 'Someplace',
            addressLine3: 'Somearea',
            addressLine4: 'Somecity',
            postcode: 'UBxx xAA',
          },
          candidateId: 105,
          candidateName: {
            firstName: 'Ali',
            lastName: 'Campbell',
            title: 'Mr',
          },
          driverNumber: 'CAMPB805220A89HC',
          mobileTelephone: '07654 123456',
          primaryTelephone: '01234 567890',
        },
        applicationReference: {
          applicationId: 1234571,
          bookingSequence: 2,
          checkDigit: 6,
        },
      },
      preTestDeclarations: {
        insuranceDeclarationAccepted: false,
        residencyDeclarationAccepted: false,
        preTestSignature: '',
      },
      accompaniment: {},
      vehicleDetails: {
        registrationNumber: '',
      },
      instructorDetails: {},
      testData: {
        dangerousFaults: {},
        drivingFaults: {},
        manoeuvres: {},
        seriousFaults: {},
        testRequirements: {},
        ETA: {},
        eco: {},
        controlledStop: {},
        vehicleChecks: {
          tellMeQuestion: {},
          showMeQuestion: {},
        },
      },
      passCompletion: {
        provisionalLicenceProvided: true,
        passCertificateNumber: 'abc123',
      },
      postTestDeclarations: {
        healthDeclarationAccepted: false,
        passCertificateNumberReceived: false,
        postTestSignature: '',
      },
      testSummary: {
        weatherConditions: [],
        identification: 'Licence',
      },
      communicationPreferences: {
        updatedEmail: '',
        communicationMethod: 'Email',
        conductedLanguage: 'English',
      },
      activityCode: '70',
      eyesightTestResult: 'P',
    },
  ];

  fetchNextUploadBatch(): Promise<StandardCarTestCATBSchema[]> {
    return Promise.resolve(this.nextBatch);
  }

  setNextBatch(nextBatch: StandardCarTestCATBSchema[]) {
    this.nextBatch = nextBatch;
  }
}
