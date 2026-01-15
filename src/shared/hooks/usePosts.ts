import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreatePostRequest,
  GetPostsParams,
  postsApi,
  UpdatePostRequest,
} from "../api/posts.service";

export const usePostsQuery = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postsApi.getPosts(params),
    staleTime: 30 * 1000,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdatePostRequest;
    }) => postsApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const usePostCommentsQuery = (
  postId?: number | string,
  params?: { limit?: number; skip?: number }
) => {
  const enabled =
    postId !== undefined && postId !== null && String(postId).trim() !== "";

  return useQuery({
    queryKey: ["posts", String(postId), "comments", params],
    queryFn: () => postsApi.getPostComments(postId as number | string, params),
    enabled,
    staleTime: 30 * 1000,
  });
};

export const usePostsCommentsCounts = (postIds: Array<number | string>) => {
  const queries = useQueries({
    queries: postIds.map((id) => ({
      queryKey: ["posts", id, "comments", "count"],
      queryFn: () =>
        postsApi
          .getPostComments(id, { limit: 1, skip: 0 })
          .then((r) => r.total),
      staleTime: 60 * 1000,
      enabled: !!id,
    })),
  });

  const map: Record<string, number | undefined> = {};
  postIds.forEach((id, i) => {
    const q = queries[i];
    map[String(id)] = q.data;
  });

  return { queries, map };
};
