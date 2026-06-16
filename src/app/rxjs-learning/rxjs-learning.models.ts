export interface UserItem {
  name: string;
  age: number;
  eligibility: boolean;
  country: string;
}

export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface ApiTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface ApiComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface DoctorItem {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
  rating: number;
  experience: number;
  nextAvailable: string;
  fee: number;
}

export interface EmployeeItem {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  bonus: number;
  deductions: number;
  yearsOfService: number;
  skills: string[];
}

export interface OrderItem {
  id: string;
  customer: string;
  items: number;
  total: number;
  priority: 'standard' | 'express';
  status: string;
}

export interface OrderSummary {
  orderId: string;
  customer: string;
  itemCount: number;
  shipping: number;
  grandTotal: number;
  eta: string;
}

export interface ArtistItem {
  id: number;
  name: string;
  genre: string;
  nationality: string;
  famousWork: string;
  birthYear: number;
}

export interface RoleTemplateItem {
  template: string;
  frequency: string;
  month: number;
  year: number;
  lastActionDate: string;
  status: string;
  comments: string;
  user: string;
}

export interface AdminTemplateItem {
  quarter: string;
  month: number;
  year: number;
  template: string;
  status: string;
  initiationdate: string;
  comments: string;
  initiatedby: string;
}
