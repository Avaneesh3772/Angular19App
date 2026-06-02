export interface TemplateList {
    template: string,
    frequency: string,
    month: number,
    year: number,
    lastActionDate: string,
    status: string,
    comments: string,
    user: string
}
export interface Users {
  employeeIdentifier: number,
  firstName: string,
  lastName: string
}

export interface UsersRole {
  employeeIdentifier: number,
  roleDescription: string,
  roleName: string,
  roleType: string;
}

