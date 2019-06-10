import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';

export const dummyTests: { [name: string]: StandardCarTestCATBSchema } = {
  fail1: {
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
  pass1: {
    id: 'bbb',
    category: 'B',
    journalData: {
      examiner: {
        staffNumber: '123',
      },
      testCentre: {
        centreId: 54321,
        costCode: 'EXTC1',
      },
      testSlotAttributes: {
        welshTest: true,
        slotId: 1003,
        start: '2019-06-10T10:14:00+01:00',
        vehicleSlotType: 'B57mins',
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
    eyesightTestResult: 'P',
    accompaniment: {},
    vehicleDetails: {
      registrationNumber: '1',
      gearboxCategory: 'Manual',
    },
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
  },

};
