import type {
  CreateUserRequest,
  GetUsersParams,
  GetUsersResponse,
  UpdateUserRequest,
  User,
} from "./users.service";

const BFF_BASE_URL = "/api";
const UPSTREAM_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://test-api.live-server.xyz";

const request = async <T>(
  baseUrl: string,
  path: string,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
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
    return request<GetUsersResponse>(
      BFF_BASE_URL,
      `/users/admins${buildQuery(params)}`,
      { method: "GET" }
    );
  },

  createAdmin: async (data: CreateUserRequest): Promise<User> => {
    return request<User>(UPSTREAM_BASE_URL, `/users/add`, {
      method: "POST",
      body: JSON.stringify({ ...data, role: "admin" }),
    });
  },

  updateAdmin: async (id: number, data: UpdateUserRequest): Promise<User> => {
    return request<User>(
      UPSTREAM_BASE_URL,
      `/users/${encodeURIComponent(String(id))}`,
      {
        method: "PATCH",
        body: JSON.stringify({ ...data, role: "admin" }),
      }
    );
  },

  deleteAdmin: async (id: number): Promise<void> => {
    await request<unknown>(
      UPSTREAM_BASE_URL,
      `/users/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },
};
