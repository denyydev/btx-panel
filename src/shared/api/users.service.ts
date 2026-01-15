export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        ]);
      }, 500);
    });
  },
};

