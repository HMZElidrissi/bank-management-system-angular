export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  monthlyIncome: number;
  creditScore: number;
  role: Role;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  age: number;
  monthlyIncome: number;
  creditScore: number;
  role: Role;
}

export interface UpdateUserRequest {
  name: string;
  age: number;
  monthlyIncome: number;
  creditScore: number;
}

export interface SearchUsersRequest {
  query: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: string;
}
