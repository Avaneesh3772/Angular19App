export interface UserDetails {
  userName: string;
  userEmail: string;
  userPhone: number | null;
  userTopic: string;
  userTimePreference: string;
  userSubscription: boolean;
}

export interface TemplateDetails {
  quarter: string;
  month: number;
  year: number;
  template: string;
  status: string;
  initiationdate: string;
  comments: string;
  initiatedby: string;
}
