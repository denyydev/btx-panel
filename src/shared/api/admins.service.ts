// shared/api/admins.service.ts
import type {
  CreateUserRequest,
  GetUsersParams,
  GetUsersResponse,
  UpdateUserRequest,
  User,
} from "./users.service";

const API_BASE_URL = "/api";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
};

const buildQuery = (params?: GetUsersParams) => {
  const qs = new URLSearchParams();
  if (!params) return "";

  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.skip != null) qs.set("skip", String(params.skip));
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);

  const s = qs.toString();
  return s ? `?${s}` : "";
};

export const adminsApi = {
  getAdmins: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    return request<GetUsersResponse>(`/users/admins${buildQuery(params)}`, {
      method: "GET",
    });
  },

  // CRUD можно вести через users endpoints
  // но чтобы было одинаково — делаем через usersApi поведение:
  createAdmin: async (data: CreateUserRequest): Promise<User> => {
    // гарантируем роль admin
    return request<User>(`/users/add`, {
      method: "POST",
      body: JSON.stringify({ ...data, role: "admin" }),
    });
  },

  updateAdmin: async (id: number, data: UpdateUserRequest): Promise<User> => {
    // гарантируем роль admin, если вдруг кто-то поменяет
    return request<User>(`/users/${encodeURIComponent(String(id))}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data, role: "admin" }),
    });
  },

  deleteAdmin: async (id: number): Promise<void> => {
    await request<unknown>(`/users/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
  },
};
