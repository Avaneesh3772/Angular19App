import { ProductItem } from './signals-learning.models';

// API URLs — mock JSON served from assets
export class SignalsConstants {
  public static get employeeDataURL(): string { return '/assets/mockData/employeeData.json'; }
  public static get doctorsDataURL(): string  { return '/assets/mockData/doctorsData.json'; }
  public static get artistDataURL(): string   { return '/assets/mockData/artistData.json'; }
}

// Shared data arrays (same as RxJS module — reused for signals demos)
export const colorsList  = ['Red', 'Blue', 'Orange', 'Pink', 'Green', 'Yellow'];
export const cityList    = ['Delhi', 'London', 'Toronto', 'New York', 'Tokyo', 'Paris'];
export const ageList     = [30, 10, 5, 20, 40, 50];
export const fruitsList  = ['Apple', 'Banana', 'Mango', 'Grape', 'Watermelon', 'Pineapple'];

export const usersList = [
  { name: 'Aditya',   age: 35, eligibility: true,  country: 'India'  },
  { name: 'Harry',    age: 22, eligibility: false,  country: 'Sweden' },
  { name: 'Vivek',    age: 29, eligibility: true,   country: 'India'  },
  { name: 'Robert',   age: 33, eligibility: false,  country: 'China'  },
  { name: 'Michael',  age: 26, eligibility: false,  country: 'Russia' },
  { name: 'Maria',    age: 17, eligibility: false,  country: 'Canada' },
];

// Product catalog — used in the Shopping Cart (signal/set/update) demo
export const techProductsList: ProductItem[] = [
  { id: 1, name: 'Angular 19 Fundamentals', price: 49,  category: 'Course'   },
  { id: 2, name: 'RxJS Deep Dive',           price: 79,  category: 'Course'   },
  { id: 3, name: 'TypeScript Handbook',      price: 39,  category: 'Book'     },
  { id: 4, name: 'VS Code Pro License',      price: 99,  category: 'Software' },
  { id: 5, name: 'JavaScript: The Good Parts', price: 29, category: 'Book'   },
  { id: 6, name: 'Node.js Microservices',    price: 59,  category: 'Course'   },
];

// Artist genres — used in the resource() demo
export const artistGenres = ['All', 'Renaissance', 'Impressionism', 'Modernism', 'Baroque'];

// Departments — used in linkedSignal demo
export const departments = ['Engineering', 'Marketing', 'HR', 'Finance'];
