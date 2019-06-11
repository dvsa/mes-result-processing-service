export interface IDateFormatter {
  /**
   * Formats a given date object as dd/MM/yyyy
   * @param date A Date object
   */
  asSlashDelimitedDate(date: Date): string;
}
