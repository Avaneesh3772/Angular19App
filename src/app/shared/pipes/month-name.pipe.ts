import { Pipe, PipeTransform } from '@angular/core';
import { AppConstants } from '../constants/app.constants';

@Pipe({
  name: 'monthName',
  standalone: true
})
export class MonthNamePipe implements PipeTransform {

  transform(monthNumber: number): string {
    return AppConstants.months[monthNumber - 1] ?? '';
  }
}
