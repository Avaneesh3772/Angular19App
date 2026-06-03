import * as moment from 'moment';

export class DateUtils {

  public static getUTCFormatTime(date: any) {
    const utcDate = moment.utc(date);    
    return utcDate.local().format('YYYY-MM-DD HH:mm:ss');
  }

  public static getUTCFormatDate(date: any) {
    const utcDate = moment.utc(date);
    return utcDate.local().format('DD-MMM-YYYY');
  }

}
