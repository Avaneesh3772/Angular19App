export class RoleConstants {
  public static displayedColumns: string[] = ["employeeIdentifier", "roleName", "roleDescription", "roleType"];
  public static get userApiURL(): string {return 'https://jsonplaceholder.typicode.com/users'}
  public static get roleMockDataURL(): string {return '/assets/mockData/roleMockData.json'}
  public static get roleAssignmentDataURL(): string {return '/assets/mockData/roleAssignmentUsersList.json'}
  public static get roleAssignmentUserDataURL(): string {return '/assets/mockData/roleAssignmentList.json'}
}

export enum frenquencyType  {
  monthly = 'monthly',
  quartely = 'quartely'
}
