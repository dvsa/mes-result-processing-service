import { ITARSPayloadConverter } from './ITARSPayloadConverter';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TARSInterfaceType } from './TARSInterfaceType';
import { ITARSPayload } from './ITARSPayload';
import { injectable, inject } from 'inversify';
import { NonCompletedTestPayload } from './NonCompletedTest';
import { CompletedTestPayload } from './CompletedTestPayload';
import { TYPES } from '../../framework/di/types';
import { CompletedTestPayloadCreationError } from './errors/CompletedTestPayloadCreationError';
import { CompletedTestInvalidCategoryError } from './errors/CompletedTestInvalidCategoryError';
import { IDateFormatter } from '../util/IDateFormatter';
import { determineDl25TestType } from '@dvsa/mes-microservice-common/application/utils/dl25-test-type';
import { licenceToIssue } from '@dvsa/mes-microservice-common/application/utils/licence-type';
import { trimTestCategoryPrefix } from '@dvsa/mes-microservice-common/domain/trim-test-category-prefix';
import { get } from 'lodash';
import { PassCompletion } from '@dvsa/mes-test-schema/categories/common';
import { ActivityCode, TestData as CatADI3TestData } from '@dvsa/mes-test-schema/categories/ADI3';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Adi3ActivityCodes } from '../util/ActivityCodes';
import { TestResult } from '../util/TestResult';

@injectable()
export class TARSPayloadConverter implements ITARSPayloadConverter {
  constructor(
    @inject(TYPES.DateFormatter) private dateFormatter: IDateFormatter,
  ) {
  }

  convertToTARSPayload(test: TestResultSchemasUnion, interfaceType: TARSInterfaceType): ITARSPayload {
    return interfaceType === TARSInterfaceType.COMPLETED ?
      this.convertToCompletedTestPayload(test) :
      this.convertToNonCompletedTestPayload(test);
  }

  convertToNonCompletedTestPayload(test: TestResultSchemasUnion): NonCompletedTestPayload {
    return {
      applicationId: test.journalData.applicationReference.applicationId,
      bookingSequence: test.journalData.applicationReference.bookingSequence,
      nonCompletionCode: Number(test.activityCode),
    };
  }

  convertToCompletedTestPayload(test: TestResultSchemasUnion): CompletedTestPayload {
    const {journalData, communicationPreferences, passCompletion, category, vehicleDetails, testSummary} = test;
    const {applicationReference, testSlotAttributes, candidate} = journalData;
    const {applicationId, bookingSequence, checkDigit} = applicationReference;
    let transmission: string = '';
    let code78Present: boolean = false;
    let testType: number = 0;

    if (vehicleDetails) {
      transmission = get(vehicleDetails, 'gearboxCategory', '');
    }
    if (passCompletion) {
      code78Present = get(passCompletion, 'code78Present', false);
    }

    if (
      !communicationPreferences ||
      !candidate.driverNumber ||
      !testSummary ||
      testSummary.D255 === undefined ||
      !vehicleDetails
    ) {
      throw new CompletedTestPayloadCreationError(test);
    }

    const determinedDl25TestType: number | undefined = determineDl25TestType(category);
    if (determinedDl25TestType === undefined) {
      throw new CompletedTestInvalidCategoryError(test);
    } else {
      testType = determinedDl25TestType;
    }

    let completedTestPayload: CompletedTestPayload = {
      applicationId,
      bookingSequence,
      checkDigit,
      language: communicationPreferences.conductedLanguage === 'English' ? 'E' : 'W',
      licenceSurrender: this.setLicenceSurrendertoFalseIfNotPresent(passCompletion),
      dl25Category: trimTestCategoryPrefix(category),
      dl25TestType: testType,
      automaticTest: licenceToIssue(category, transmission, code78Present) === 'Automatic',
      extendedTest: testSlotAttributes.extendedTest,
      d255Selected: testSummary.D255,
      passResult: test.activityCode === '1',
      driverNumber: candidate.driverNumber,
      testDate: this.dateFormatter.asSlashDelimitedDate(new Date(testSlotAttributes.start)),
    };
    completedTestPayload = this.populatePassCertificateIfPresent(completedTestPayload, passCompletion);
    completedTestPayload = this.populateMark(completedTestPayload, category as TestCategory, test);
    completedTestPayload = this.populateStandardCheckTestResult(completedTestPayload, category as TestCategory, test);
    return completedTestPayload;
  }

  private setLicenceSurrendertoFalseIfNotPresent(passCompletion: Partial<PassCompletion> | undefined): boolean {
    if (!passCompletion) return false;
    return get(passCompletion, 'provisionalLicenceProvided', false);
  }

  private populatePassCertificateIfPresent(
    completedTestPayload: CompletedTestPayload,
    passCompletion: Partial<PassCompletion> | undefined,
  ): CompletedTestPayload {
    if (!passCompletion) {
      return completedTestPayload;
    }
    return {
      ...completedTestPayload,
      passCertificate: passCompletion.passCertificateNumber,
    };
  }

  /**
   * Add mark to payload if test is
   * ADI3/SC with a pass result
   * @param completedTestPayload
   * @param category
   * @param test
   * @private
   */
  private populateMark(
    completedTestPayload: CompletedTestPayload,
    category: TestCategory,
    test: TestResultSchemasUnion,
  ): CompletedTestPayload {
    if ((category !== TestCategory.ADI3 && category !== TestCategory.SC) || !completedTestPayload.passResult) {
      return completedTestPayload;
    }
    return {
      ...completedTestPayload,
      mark: this.getTotalAssessmentScore(test.testData as CatADI3TestData),
    };
  }

  /**
   * Add TestResult to payload if test is SC
   * @param completedTestPayload
   * @param category
   * @param test
   * @private
   */
  private populateStandardCheckTestResult(
    completedTestPayload: CompletedTestPayload,
    category: TestCategory,
    test: TestResultSchemasUnion,
  ): CompletedTestPayload {

    if (category === TestCategory.SC) {
      return {
        ...completedTestPayload,
        testResult: this.getStandardCheckTestResult(
          completedTestPayload.passResult,
          test?.testData as CatADI3TestData,
          test?.journalData?.candidate?.previousADITests,
          test.activityCode),
      };
    }
    return completedTestPayload;
  }

  /**
   * Calculate total assessment score of an ADI3 test
   * @param testData
   */
  private getTotalAssessmentScore = (testData: CatADI3TestData): number => {
    return Object.keys(testData).reduce((sum, key: string): number => {
      const value = get(testData, key);
      if (['lessonPlanning', 'riskManagement', 'teachingLearningStrategies']
        .includes(key) && typeof value === 'object') {
        return sum + (get(value, 'score') || 0);
      }
      return sum;
    }, 0);
  };

  /**
   * Determine the test result for standard checks
   * @param passResult
   * @param testData
   * @param previousADITests
   * @param activityCode
   */
  getStandardCheckTestResult = (
    passResult: boolean,
    testData: CatADI3TestData,
    previousADITests: number | undefined,
    activityCode: ActivityCode): string => {

    // Pass
    if (passResult) return TestResult.PASS;

    // Failed
    const isAutomatic =
      get(testData, 'riskManagement.score', 0) < 8 ||
      activityCode === Adi3ActivityCodes.FAIL_PUBLIC_SAFETY
        ? TestResult.AUTOMATIC : '';
    return TestResult.FAIL.concat(isAutomatic, String(this.AdiAttempts(previousADITests)));
  };

  /**
   * Calculate the correct value for result code based upon previous attempts
   * @param attempts
   * @constructor
   */
  AdiAttempts(attempts: number | undefined): number {
    if (!attempts || attempts < 0) {
      return 1;
    } else if (attempts <= 2) {
      return attempts + 1;
    } else {
      return 3;
    }
  }
}
