import { http } from './http';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data,
    });
  },

  me: async (token: string): Promise<User> => {
    return http<User>('/auth/me', {
      method: 'GET',
      token,
    });
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  },
};

