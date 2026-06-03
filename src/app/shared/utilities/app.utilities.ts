import * as moment from 'moment';

export class DateUtils {

  /**
   * Converts a UTC date string to local time formatted as YYYY-MM-DD HH:mm:ss
   */
  public static getUTCFormatTime(date: string): string {
    return moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');

    // Native JS equivalent (no moment dependency) — kept for reference:
    // const localDate = new Date(date + ' UTC');
    // const yyyy = localDate.getFullYear();
    // const mm = String(localDate.getMonth() + 1).padStart(2, '0');
    // const dd = String(localDate.getDate()).padStart(2, '0');
    // const hh = String(localDate.getHours()).padStart(2, '0');
    // const min = String(localDate.getMinutes()).padStart(2, '0');
    // const ss = String(localDate.getSeconds()).padStart(2, '0');
    // return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }

  /**
   * Converts a UTC date string to local date formatted as DD-MMM-YYYY (e.g. 05-Dec-2021)
   */
  public static getUTCFormatDate(date: string): string {
    return moment.utc(date).local().format('DD-MMM-YYYY');

    // Native JS equivalent (no moment dependency) — kept for reference:
    // const localDate = new Date(date + ' UTC');
    // return localDate.toLocaleDateString('en-GB', {
    //   day: '2-digit', month: 'short', year: 'numeric'
    // }).replace(/ /g, '-');
  }
}
