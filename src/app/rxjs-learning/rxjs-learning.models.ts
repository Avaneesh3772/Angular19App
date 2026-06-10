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
