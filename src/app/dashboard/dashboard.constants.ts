export class DashboardConstants {
  public static displayedColumns: string[] = ["id", "name", "username", "email", "phone"];
  public static get userApiURL(): string {return 'https://jsonplaceholder.typicode.com/users'}
}

export const Confirmation = {
  yes: 'Yes',
  no: 'No'
}
