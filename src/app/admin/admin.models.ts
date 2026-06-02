export class UserDetails {
  constructor(
       public userName: string,
       public userEmail: string,
       public userPhone: number,
       public userTopic: string,
       public userTimePreference: string,
       public userSubscription?: boolean,
  ) { }
}
export interface TemplateDetails {
       quarter: string,
       month: number,
       year: number,
       template: string,
       status: string,
       initiationdate: string,
       comments: string,
       initiatedby: string,
}
