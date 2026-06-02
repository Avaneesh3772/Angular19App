export class AppConstants {
  public static months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public static get appConfigDataURL(): string {return '/assets/mockData/appConfiguration.json'}
}
export const AuthToken = 'aeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';

/* export const statusType = {
  uploaded: 'Uploaded',
  success: 'Success',
  failed: 'Failed',
} */

export enum statusType {
  uploaded = 'Uploaded',
  success = 'Success',
  failed = 'Failed',
}
