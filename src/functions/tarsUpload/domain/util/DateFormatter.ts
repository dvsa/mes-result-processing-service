import { IDateFormatter } from './IDateFormatter';
import { injectable } from 'inversify';

@injectable()
export class DateFormatter implements IDateFormatter {
  asSlashDelimitedDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }
}
