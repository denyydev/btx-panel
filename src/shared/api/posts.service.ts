export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReactions;
  views: number;
  userId: number;
}

export interface GetPostsParams {
  limit?: number;
  skip?: number;
  search?: string;
  sort?: string;
}

export interface GetPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  userId?: number;
  tags?: string[];
}

export interface CommentUser {
  id: number;
  username: string;
  fullName: string;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: CommentUser;
}

export interface GetPostCommentsResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

export interface GetPostsTagsResponse {
  tags: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const mapSort = (
  sort?: string
): {
  sortBy?: string;
  order?: "asc" | "desc";
  clientField?: "likes" | "comments";
} => {
  if (!sort) return {};
  const [fieldRaw, dirRaw] = sort.split(":");
  const order = dirRaw?.trim() === "desc" ? "desc" : "asc";
  const field = (fieldRaw || "").trim();

  if (field === "id") return { sortBy: "id", order };
  if (field === "views") return { sortBy: "views", order };

  // апстрим обычно не умеет nested sort reactions.likes
  if (field === "likes") return { clientField: "likes", order };

  // comments count вообще нет в posts list
  if (field === "comments") return { clientField: "comments", order };

  return {};
};

const parseSort = (
  sort?: string
): { sortBy: string; order: "asc" | "desc" } | null => {
  if (!sort) return null;
  const [sortByRaw, orderRaw] = sort.split(":");
  const sortBy = sortByRaw?.trim();
  const order = orderRaw?.trim() === "desc" ? "desc" : "asc";
  if (!sortBy) return null;
  return { sortBy, order };
};

const buildQuery = (
  params?: Omit<GetPostsParams, "search" | "sort"> & {
    sortBy?: string;
    order?: "asc" | "desc";
  }
) => {
  const qs = new URLSearchParams();
  if (!params) return "";
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.skip != null) qs.set("skip", String(params.skip));
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.order === "asc" || params.order === "desc")
    qs.set("order", params.order);
  const s = qs.toString();
  return s ? `?${s}` : "";
};

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

export const postsApi = {
  getPosts: async (params?: GetPostsParams): Promise<GetPostsResponse> => {
    const { sortBy, order, clientField } = mapSort(params?.sort);

    const qs = buildQuery({
      limit: params?.limit,
      skip: params?.skip,
      sortBy,
      order,
    });

    const base = params?.search?.trim()
      ? `/posts/search?q=${encodeURIComponent(params.search.trim())}${
          qs ? `&${qs.slice(1)}` : ""
        }`
      : `/posts${qs}`;

    const res = await request<GetPostsResponse>(base, { method: "GET" });

    // client fallback сортировка только по текущей странице
    if (clientField === "likes") {
      const dir = order === "desc" ? -1 : 1;
      return {
        ...res,
        posts: [...res.posts].sort(
          (a, b) => (a.reactions?.likes - b.reactions?.likes) * dir
        ),
      };
    }

    // comments — пока просто вернем как есть (отсортируем позже, когда будут counts)
    return res;
  },

  getPost: async (id: number | string): Promise<Post> => {
    return request<Post>(`/posts/${encodeURIComponent(String(id))}`, {
      method: "GET",
    });
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    return request<Post>(`/posts/add`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updatePost: async (
    id: number | string,
    data: UpdatePostRequest
  ): Promise<Post> => {
    return request<Post>(`/posts/${encodeURIComponent(String(id))}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deletePost: async (id: number | string): Promise<void> => {
    await request<unknown>(`/posts/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
  },

  getPostComments: async (
    postId: number | string,
    params?: { limit?: number; skip?: number }
  ): Promise<GetPostCommentsResponse> => {
    const qs = new URLSearchParams();
    if (params?.limit != null) qs.set("limit", String(params.limit));
    if (params?.skip != null) qs.set("skip", String(params.skip));
    const s = qs.toString();
    const tail = s ? `?${s}` : "";
    return request<GetPostCommentsResponse>(
      `/comments/post/${encodeURIComponent(String(postId))}${tail}`,
      { method: "GET" }
    );
  },

  getPostCommentsViaPost: async (
    postId: number | string,
    params?: { limit?: number; skip?: number }
  ): Promise<GetPostCommentsResponse> => {
    const qs = new URLSearchParams();
    if (params?.limit != null) qs.set("limit", String(params.limit));
    if (params?.skip != null) qs.set("skip", String(params.skip));
    const s = qs.toString();
    const tail = s ? `?${s}` : "";
    return request<GetPostCommentsResponse>(
      `/posts/${encodeURIComponent(String(postId))}/comments${tail}`,
      { method: "GET" }
    );
  },

  getTags: async (): Promise<GetPostsTagsResponse> => {
    return request<GetPostsTagsResponse>(`/posts/tags`, { method: "GET" });
  },

  getPostCommentsCount: async (postId: number | string): Promise<number> => {
    const res = await postsApi.getPostComments(postId, { limit: 1, skip: 0 });
    return res.total;
  },
};
