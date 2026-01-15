export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: '1',
            email: data.email,
            name: 'Admin User',
            role: 'admin',
          },
        });
      }, 500);
    });
  },

  logout: async (): Promise<void> => {
  },

  verifyToken: async (token: string): Promise<boolean> => {
    return Promise.resolve(true);
  },
};

