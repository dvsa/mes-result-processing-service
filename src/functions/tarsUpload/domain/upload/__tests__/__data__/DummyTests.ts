import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

const emptyVehicleDetails: CatBUniqueTypes.VehicleDetails = {};
const manualVehicleDetails: CatBUniqueTypes.VehicleDetails = {
  registrationNumber: '1',
  gearboxCategory: 'Manual',
};

export const dummyTests: { [name: string]: TestResultSchemasUnion } = {
  passWithInvalidCategory: {
    version: '0.0.1',
    category: 'X' as CategoryCode,
    journalData: {
      examiner: {
        staffNumber: '321',
      },
      testCentre: {
        centreId: 54321,
        costCode: 'EXTC1',
      },
      testSlotAttributes: {
        welshTest: true,
        slotId: 1003,
        start: '2019-06-10T10:14:00+01:00',
        vehicleTypeCode: 'C',
        extendedTest: false,
        specialNeeds: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'My House',
          addressLine2: 'Someplace',
          addressLine3: 'Sometown',
          postcode: 'ABxx xCD',
        },
        candidateId: 103,
        candidateName: {
          firstName: 'Jane',
          lastName: 'Doe',
          title: 'Mrs',
        },
        driverNumber: 'DOEXX625220A99HC',
        mobileTelephone: '07654 123456',
        emailAddress: 'test@test.com',
      },
      applicationReference: {
        applicationId: 1234569,
        bookingSequence: 1,
        checkDigit: 9,
      },
    },
    preTestDeclarations: {
      insuranceDeclarationAccepted: true,
      residencyDeclarationAccepted: true,
      preTestSignature: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0',
    },
    accompaniment: {},
    vehicleDetails: manualVehicleDetails,
    instructorDetails: {},
    testData: {
      dangerousFaults: {},
      drivingFaults: {
        moveOffSafety: 1,
      },
      manoeuvres: {
        reverseRight: {
          selected: true,
        },
      },
      seriousFaults: {},
      testRequirements: {
        normalStart1: true,
        normalStart2: true,
        angledStart: true,
        hillStart: true,
      },
      ETA: {},
      eco: {
        completed: true,
      },
      controlledStop: {
        selected: true,
      },
      vehicleChecks: {
        tellMeQuestion: {
          code: 'T5',
          description: 'Tell me how you would check that the headlights & tail lights are working',
          outcome: 'P',
        },
        showMeQuestion: {
          code: 'S5',
          description: 'When it is safe to do so can you show me how you would operate the horn.',
        },
      },
      eyesightTest: {
        complete: true,
      },
    },
    passCompletion: {
      provisionalLicenceProvided: true,
      passCertificateNumber: 'passcert',
    },
    postTestDeclarations: {
      healthDeclarationAccepted: true,
      passCertificateNumberReceived: true,
      postTestSignature: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz',
    },
    testSummary: {
      routeNumber: 2,
      independentDriving: 'Sat nav',
      candidateDescription: 'Tall',
      weatherConditions: [
        'Showers',
      ],
      debriefWitnessed: true,
      D255: true,
      identification: 'Licence',
    },
    communicationPreferences: {
      updatedEmail: 'test@test.com',
      communicationMethod: 'Email',
      conductedLanguage: 'Cymraeg',
    },
    activityCode: '1',
    rekey: false,
    changeMarker: false,
    examinerBooked: 12345678,
    examinerConducted: 12345678,
    examinerKeyed: 12345678,
  },

};
