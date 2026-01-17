"use client";

import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { usePostsCommentsCounts, usePostsQuery } from "@/shared/hooks/usePosts";
import { useUsersQuery } from "@/shared/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { PostsPageVM, SortDir, SortKey } from "./types";
import { nextDir } from "./utils";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export function usePostsPage(): PostsPageVM {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const skip = (page - 1) * rowsPerPage;

  const serverSort =
    sortKey === "id" || sortKey === "views"
      ? `${sortKey}:${sortDir}`
      : undefined;

  const postsQ = usePostsQuery({
    limit: rowsPerPage,
    skip,
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    sort: serverSort,
  });

  const usersQ = useUsersQuery({ limit: 300, skip: 0 });

  const usersMap = useMemo(() => {
    const map = new Map<number, any>();
    const users =
      (usersQ.data as any)?.users || (usersQ.data as any)?.data || [];
    for (const u of users) map.set(Number(u.id), u);
    return map;
  }, [usersQ.data]);

  const posts = (postsQ.data as any)?.posts || [];
  const total = (postsQ.data as any)?.total ?? 0;
  const pages = postsQ.data ? Math.ceil(total / rowsPerPage) : 1;

  const rowsWithAuthor = useMemo(() => {
    return posts.map((p: any) => {
      const user = usersMap.get(Number(p.userId));
      return { ...p, user };
    });
  }, [posts, usersMap]);

  const postIds = useMemo(
    () => rowsWithAuthor.map((p: any) => p.id),
    [rowsWithAuthor]
  );

  const commentsCountsQ = usePostsCommentsCounts(postIds);

  const sortedRows = useMemo(() => {
    const rows = [...rowsWithAuthor];
    const dir = sortDir === "asc" ? 1 : -1;

    if (sortKey === "likes") {
      rows.sort(
        (a: any, b: any) =>
          ((a?.reactions?.likes ?? 0) - (b?.reactions?.likes ?? 0)) * dir
      );
    } else if (sortKey === "comments") {
      rows.sort((a: any, b: any) => {
        const ac = commentsCountsQ.map[String(a.id)] ?? 0;
        const bc = commentsCountsQ.map[String(b.id)] ?? 0;
        return (ac - bc) * dir;
      });
    }

    return rows;
  }, [rowsWithAuthor, sortKey, sortDir, commentsCountsQ.map]);

  const isInitialLoading =
    (postsQ.isLoading && !postsQ.data) || (usersQ.isLoading && !usersQ.data);

  const isRefetching =
    postsQ.isFetching ||
    usersQ.isFetching ||
    commentsCountsQ.queries.some((q) => q.isFetching);

  const onPageSizeChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onSort = (key: SortKey) => {
    setPage(1);
    if (sortKey === key) {
      setSortDir((d) => nextDir(d));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return "⇅";
    return sortDir === "asc" ? "↑" : "↓";
  };

  const goToComments = (postId: number) => {
    router.push(`/dashboard/posts/comments?postId=${postId}`);
  };

  return {
    page,
    rowsPerPage,
    search,
    sortKey,
    sortDir,

    pages,
    isInitialLoading,
    isRefetching,

    rows: sortedRows,
    commentsMap: commentsCountsQ.map,

    setPage,
    onPageSizeChange,
    onSearchChange,
    onSort,
    sortIcon,

    goToComments,

    error: postsQ.error,
  };
}
