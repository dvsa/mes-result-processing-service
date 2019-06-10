import { ITARSPayload } from './ITARSPayload';

export interface CompletedTestPayload extends ITARSPayload {
  // Integer > 0, max 12 digits
  checkDigit: number;

  // 'E' / 'W' (English or Welsh)
  languageId: string;

  licenceSurrender: boolean;

  // 6 chars max
  dL25Category: string;

  // Integer > 0, max 2 digits
  dL25TestType: number;

  automaticTest: boolean;

  extendedTest: boolean;

  d255Selected: boolean;

  // true=>pass false=>fail
  passResult: boolean;

  // 8 or 16 characters
  driverNumber: string;

  // Format DD/MM/YYYY
  testDate: string;

  // Max 8 chars
  passCertificate: string;
}
