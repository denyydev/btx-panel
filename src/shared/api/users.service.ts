export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface GetUsersParams {
  limit?: number;
  skip?: number;
  search?: string;
  sort?: string;
}

export interface GetUsersResponse {
  data: User[];
  total: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'admin' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'user' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' },
];

let usersData = [...mockUsers];
let nextId = 6;

export const usersApi = {
  getUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...usersData];

        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filtered = filtered.filter(
            (user) =>
              user.name.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower)
          );
        }

        if (params?.sort) {
          const [field, direction] = params.sort.split(':');
          filtered.sort((a, b) => {
            const aVal = a[field as keyof User] || '';
            const bVal = b[field as keyof User] || '';
            const comparison = String(aVal).localeCompare(String(bVal));
            return direction === 'desc' ? -comparison : comparison;
          });
        }

        const total = filtered.length;
        const skip = params?.skip || 0;
        const limit = params?.limit || 10;
        const paginated = filtered.slice(skip, skip + limit);

        resolve({
          data: paginated,
          total,
        });
      }, 300);
    });
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: String(nextId++),
          ...data,
        };
        usersData.push(newUser);
        resolve(newUser);
      }, 300);
    });
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = usersData.findIndex((u) => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }
        usersData[index] = { ...usersData[index], ...data };
        resolve(usersData[index]);
      }, 300);
    });
  },

  deleteUser: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = usersData.findIndex((u) => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }
        usersData.splice(index, 1);
        resolve();
      }, 300);
    });
  },
};

