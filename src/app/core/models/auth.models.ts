export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER' | 'EMPLOYEE';
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  name: string;
  email: string;
  role: string;
}
