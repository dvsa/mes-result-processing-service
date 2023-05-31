import { ITARSPayload } from './ITARSPayload';

export interface CompletedTestPayload extends ITARSPayload {
  // Integer > 0, max 12 digits
  checkDigit: number;

  /**
   * 'E' / 'W' (English or Welsh)
   */
  language: string;

  licenceSurrender: boolean;

  /**
   * 6 chars max
   */
  dl25Category: string;

  /**
   * Integer > 0, max 2 digits
   */
  dl25TestType: number;

  automaticTest: boolean;

  extendedTest: boolean;

  d255Selected: boolean;

  /**
   * true=>pass false=>fail
   */
  passResult: boolean;

  /**
   * 8 or 16 characters
   */
  driverNumber: string;

  /**
   * Format DD/MM/YYYY
   */
  testDate: string;

  /**
   * Max 8 chars - omitted for failed tests
   */
  passCertificate?: string;

  /**
   * Adi3 - The Mark received when completed the Test (It can be null or should be numeric 2 digits)
   */
  mark?: number;

  /**
   * Standard Check - The Mark received when completed the Test (It can be null or should be numeric 2 digits)
   */
  testResult?: string;
}
