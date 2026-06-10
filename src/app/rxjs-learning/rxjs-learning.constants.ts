export class RxjsConstants {
  public static get usersApiURL(): string { return 'https://jsonplaceholder.typicode.com/users'; }
  public static get todosApiURL(): string { return 'https://jsonplaceholder.typicode.com/todos'; }
  public static get commentsApiURL(): string { return 'https://jsonplaceholder.typicode.com/comments'; }
}

export const colorsList = ['Red', 'Blue', 'Orange', 'Pink', 'Green', 'Yellow'];
export const cityList   = ['Delhi', 'London', 'Toronto', 'New York', 'Tokyo', 'Paris'];
export const ageList    = [30, 10, 5, 20, 40, 50];
export const fruitsList = ['Apple', 'Banana', 'Mango', 'Grape', 'Watermelon', 'Pineapple'];

export const usersList = [
  { name: 'Aditya',   age: 35, eligibility: true,  country: 'India'  },
  { name: 'Harry',    age: 22, eligibility: false, country: 'Sweden' },
  { name: 'Vivek',    age: 29, eligibility: true,  country: 'India'  },
  { name: 'Robert',   age: 33, eligibility: false, country: 'China'  },
  { name: 'Michael',  age: 26, eligibility: false, country: 'Russia' },
  { name: 'Maria',    age: 17, eligibility: false, country: 'Canada' },
];
