export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'ADMIN';
  mobile: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
}
