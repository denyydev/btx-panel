"use client";

import { usePostCommentsQuery } from "@/shared/hooks/usePosts";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { CommentsPageVM } from "./types";
import { ROWS_PER_PAGE_OPTIONS } from "./utils";

export function useCommentsPage(): CommentsPageVM {
  const router = useRouter();
  const sp = useSearchParams();

  const postIdRaw = sp.get("postId");
  const postIdNum = postIdRaw ? Number(postIdRaw) : NaN;
  const postId = Number.isFinite(postIdNum) ? postIdNum : undefined;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState("");

  const skip = (page - 1) * rowsPerPage;

  const query = usePostCommentsQuery(postId, { limit: rowsPerPage, skip });

  const rowsRaw = query.data?.comments || [];
  const pages = query.data ? Math.ceil(query.data.total / rowsPerPage) : 1;

  const header = useMemo(() => {
    if (!postId) return "Комментарии к посту";
    return `Комментарии к посту #${postId}`;
  }, [postId]);

  const subtitle = useMemo(() => {
    const first = rowsRaw?.[0] as any;
    const title =
      first?.post?.title ||
      first?.postTitle ||
      first?.post?.name ||
      first?.postName ||
      "";
    return title || "Просмотр и модерация комментариев";
  }, [rowsRaw]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rowsRaw;
    return rowsRaw.filter((c: any) =>
      String(c.body || "")
        .toLowerCase()
        .includes(q)
    );
  }, [rowsRaw, search]);

  const onSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const onPageSizeChange = (v: number) => {
    setRowsPerPage(v);
    setPage(1);
  };

  const goBack = () => router.push("/dashboard/posts");

  return {
    postId,

    page,
    rowsPerPage,
    search,

    pages,

    isLoading: query.isLoading && !query.data,
    isRefetching: query.isFetching,

    header,
    subtitle,

    rows,

    setPage,
    onSearchChange,
    onPageSizeChange,

    goBack,

    error: query.error,

    pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
  };
}
