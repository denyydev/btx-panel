export type Role = "admin" | "user" | "moderator";

export interface User {
  id: number;

  firstName: string;
  lastName: string;
  maidenName?: string;

  email: string;
  birthDate?: string;
  image?: string;

  gender?: string;
  role: Role;
}

export interface UserMetrics {
  postCount: number;
  likeCount: number;
  commentCount: number;
}

export type UserWithMetrics = User & UserMetrics;

export interface GetUsersWithMetricsResponse {
  users: UserWithMetrics[];
  total: number;
  skip: number;
  limit: number;
}

export interface GetUsersParams {
  limit?: number;
  skip?: number;
  search?: string;
  sort?: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  birthDate?: string;
  role?: Role;
  image?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  birthDate?: string;
  role?: Role;
  image?: string;
}

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

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
};

const mapSort = (
  sort?: string
): { sortBy?: string; order?: "asc" | "desc" } => {
  if (!sort) return {};
  const [fieldRaw, dirRaw] = sort.split(":");
  const order = dirRaw === "desc" ? "desc" : "asc";

  const field = (fieldRaw || "").trim();

  if (field === "name") return { sortBy: "firstName", order };
  if (field === "email") return { sortBy: "email", order };
  if (field === "birthDate") return { sortBy: "birthDate", order };
  if (field === "role") return { sortBy: "role", order };
  if (field === "firstName") return { sortBy: "firstName", order };
  if (field === "lastName") return { sortBy: "lastName", order };

  return {};
};

const buildQuery = (params?: GetUsersParams) => {
  const qs = new URLSearchParams();

  if (params?.limit != null) qs.set("limit", String(params.limit));
  if (params?.skip != null) qs.set("skip", String(params.skip));

  const { sortBy, order } = mapSort(params?.sort);
  if (sortBy) qs.set("sortBy", sortBy);
  if (order) qs.set("order", order);

  const s = qs.toString();
  return s ? `?${s}` : "";
};

export const usersApi = {
  getUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    if (params?.search?.trim()) {
      const qs = new URLSearchParams();
      qs.set("q", params.search.trim());

      if (params.limit != null) qs.set("limit", String(params.limit));
      if (params.skip != null) qs.set("skip", String(params.skip));

      const { sortBy, order } = mapSort(params.sort);
      if (sortBy) qs.set("sortBy", sortBy);
      if (order) qs.set("order", order);

      return request<GetUsersResponse>(
        UPSTREAM_BASE_URL,
        `/users/search?${qs.toString()}`,
        { method: "GET" }
      );
    }

    return request<GetUsersResponse>(
      UPSTREAM_BASE_URL,
      `/users${buildQuery(params)}`,
      { method: "GET" }
    );
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const { firstName, lastName } = splitName(data.name);

    return request<User>(UPSTREAM_BASE_URL, `/users/add`, {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email: data.email,
        birthDate: data.birthDate,
        role: data.role ?? "user",
        image: data.image,
      }),
    });
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const patch: Record<string, unknown> = {};

    if (data.name != null) {
      const { firstName, lastName } = splitName(data.name);
      patch.firstName = firstName;
      patch.lastName = lastName;
    }
    if (data.email != null) patch.email = data.email;
    if (data.birthDate != null) patch.birthDate = data.birthDate;
    if (data.role != null) patch.role = data.role;
    if (data.image != null) patch.image = data.image;

    return request<User>(
      UPSTREAM_BASE_URL,
      `/users/${encodeURIComponent(String(id))}`,
      {
        method: "PATCH",
        body: JSON.stringify(patch),
      }
    );
  },

  deleteUser: async (id: number): Promise<void> => {
    await request<unknown>(
      UPSTREAM_BASE_URL,
      `/users/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
  },

  getUsersWithMetrics: async (
    params?: GetUsersParams
  ): Promise<GetUsersWithMetricsResponse> => {
    const qs = new URLSearchParams();
    if (params?.limit != null) qs.set("limit", String(params.limit));
    if (params?.skip != null) qs.set("skip", String(params.skip));

    return request<GetUsersWithMetricsResponse>(
      BFF_BASE_URL,
      `/users/metrics?${qs.toString()}`,
      { method: "GET" }
    );
  },
};
