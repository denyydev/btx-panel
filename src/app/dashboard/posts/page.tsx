"use client";

import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { usePostsCommentsCounts, usePostsQuery } from "@/shared/hooks/usePosts";
import { useUsersQuery } from "@/shared/hooks/useUsers";
import { AppPagination } from "@/shared/ui/AppPagination/AppPagination";
import { AppSearchInput } from "@/shared/ui/AppSearchInput/AppSearchInput";
import { AppTable } from "@/shared/ui/AppTable/AppTable";
import {
  Avatar,
  Button,
  Spinner,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

type SortKey = "id" | "views" | "likes" | "comments";
type SortDir = "asc" | "desc";

const authorShort = (u?: any) => {
  if (!u) return "-";
  const last = (u.lastName || "").trim();
  const first = (u.firstName || "").trim();
  return `${last} ${first ? first[0] + "." : ""}`.trim();
};

const nextDir = (dir: SortDir): SortDir => (dir === "asc" ? "desc" : "asc");

export default function PostsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const skip = (page - 1) * rowsPerPage;

  // server sort только там, где апстрим точно умеет
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

  // client-side sort для likes/comments (потому что server не умеет / данных нет в posts list)
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
    // id/views на сервере, тут не трогаем
    return rows;
  }, [rowsWithAuthor, sortKey, sortDir, commentsCountsQ.map]);

  const isInitialLoading =
    (postsQ.isLoading && !postsQ.data) || (usersQ.isLoading && !usersQ.data);

  // рефетч — не прячем таблицу, просто оверлей над списком/таблицей
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

  if (postsQ.error) {
    return <div className="text-red-600 p-4">Ошибка загрузки постов</div>;
  }

  return (
    <div className="bg-[#E6F1FE] min-h-[calc(100vh-0px)]">
      <div className="mx-auto w-full max-w-[1472px]">
        <div className="px-5 lg:px-0 pt-6 lg:pt-0">
          <div className="flex flex-col items-start gap-3 lg:gap-5">
            <h1 className="text-[20px] leading-7 lg:text-[36px] lg:leading-10 font-semibold text-[#11181C]">
              Публикации
            </h1>
            <p className="text-[14px] leading-5 lg:text-[18px] lg:leading-7 font-normal text-[#3F3F46]">
              Управление публикациями пользователей
            </p>

            <AppSearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Поиск по названию поста"
              className="w-full max-w-[746px]"
            />
          </div>
        </div>

        <div className="mt-5 lg:mt-10">
          {isInitialLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="lg:hidden px-0 relative">
                <div className="rounded-t-[16px] overflow-hidden relative">
                  {sortedRows.length ? (
                    sortedRows.map((p: any) => {
                      const u = p.user;
                      const name = authorShort(u);
                      const author = name !== "-" ? name : `User ${p.userId}`;
                      const commentsCount = commentsCountsQ.map[String(p.id)];

                      return (
                        <div
                          key={p.id}
                          className="box-border w-full bg-white border-b border-[#E4E4E7] px-5 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] leading-4 font-normal text-[#52525B]">
                              {p.id}
                            </span>

                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="min-w-0 w-6 h-6 text-[#71717A]"
                              onPress={() =>
                                router.push(
                                  `/dashboard/posts/comments?postId=${p.id}`
                                )
                              }
                            >
                              →
                            </Button>
                          </div>

                          <div className="mt-2 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={u?.image}
                                name={author}
                                className="w-5 h-5 shrink-0"
                              />
                              <span className="text-[14px] leading-5 font-normal text-[#27272A] truncate">
                                {author}
                              </span>
                            </div>

                            <div className="text-[14px] leading-5 font-semibold text-[#27272A]">
                              {p.title || p.name || "-"}
                            </div>

                            <div className="flex items-center gap-4 text-[12px] leading-4 font-normal text-[#52525B]">
                              <span>👁 {p.views ?? "-"}</span>
                              <span>❤ {p.reactions?.likes ?? "-"}</span>
                              <span>💬 {commentsCount ?? "-"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-white p-4 text-[14px] leading-5 font-normal text-[#52525B]">
                      Посты не найдены
                    </div>
                  )}

                  {isRefetching && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                      <Spinner />
                    </div>
                  )}
                </div>

                <div className="px-5 py-4">
                  <AppPagination
                    page={page}
                    totalPages={pages}
                    onChange={setPage}
                    pageSize={rowsPerPage}
                    pageSizeOptions={
                      ROWS_PER_PAGE_OPTIONS as unknown as number[]
                    }
                    onPageSizeChange={onPageSizeChange}
                  />
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <AppTable ariaLabel="Posts table">
                    <TableHeader>
                      <TableColumn key="id">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2"
                          onClick={() => onSort("id")}
                        >
                          ID{" "}
                          <span className="text-xs opacity-70">
                            {sortIcon("id")}
                          </span>
                        </button>
                      </TableColumn>

                      <TableColumn key="title">Пост</TableColumn>
                      <TableColumn key="author">Автор</TableColumn>

                      <TableColumn key="views">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2"
                          onClick={() => onSort("views")}
                        >
                          Просмотры{" "}
                          <span className="text-xs opacity-70">
                            {sortIcon("views")}
                          </span>
                        </button>
                      </TableColumn>

                      <TableColumn key="likes">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2"
                          onClick={() => onSort("likes")}
                        >
                          Лайки{" "}
                          <span className="text-xs opacity-70">
                            {sortIcon("likes")}
                          </span>
                        </button>
                      </TableColumn>

                      <TableColumn key="comments">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2"
                          onClick={() => onSort("comments")}
                        >
                          Комментарии{" "}
                          <span className="text-xs opacity-70">
                            {sortIcon("comments")}
                          </span>
                        </button>
                      </TableColumn>

                      <TableColumn key="actions" className="w-12">
                        Действия
                      </TableColumn>
                    </TableHeader>

                    <TableBody
                      items={sortedRows}
                      emptyContent="Посты не найдены"
                    >
                      {(p: any) => {
                        const u = p.user;
                        const name = authorShort(u);
                        const author = name !== "-" ? name : `User ${p.userId}`;
                        const commentsCount = commentsCountsQ.map[String(p.id)];

                        return (
                          <TableRow key={p.id}>
                            <TableCell>{p.id}</TableCell>

                            <TableCell>
                              <div className="max-w-[420px] truncate font-medium">
                                {p.title || p.name || "-"}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={u?.image}
                                  name={author}
                                  className="shrink-0"
                                />
                                <span className="font-medium">{author}</span>
                              </div>
                            </TableCell>

                            <TableCell>{p.views ?? "-"}</TableCell>
                            <TableCell>{p.reactions?.likes ?? "-"}</TableCell>
                            <TableCell>{commentsCount ?? "-"}</TableCell>

                            <TableCell>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() =>
                                  router.push(
                                    `/dashboard/posts/comments?postId=${p.id}`
                                  )
                                }
                              >
                                →
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }}
                    </TableBody>
                  </AppTable>

                  {isRefetching && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                      <Spinner />
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <AppPagination
                    page={page}
                    totalPages={pages}
                    onChange={setPage}
                    pageSize={rowsPerPage}
                    pageSizeOptions={
                      ROWS_PER_PAGE_OPTIONS as unknown as number[]
                    }
                    onPageSizeChange={onPageSizeChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
