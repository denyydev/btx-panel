"use client";

import { usePostCommentsQuery } from "@/shared/hooks/usePosts";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

const authorShort = (u?: any) => {
  if (!u) return "-";
  const full = (u.fullName || "").trim();
  if (full) {
    const parts = full.split(/\s+/).filter(Boolean);
    const last = parts[0] || "";
    const first = parts[1] || "";
    return `${last} ${first ? first[0] + "." : ""}`.trim();
  }
  const username = (u.username || "").trim();
  return username || "-";
};

export default function CommentsPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const postIdRaw = sp.get("postId");
  const postId = postIdRaw ? Number(postIdRaw) : NaN;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState("");

  const skip = (page - 1) * rowsPerPage;

  const { data, isLoading, error } = usePostCommentsQuery(
    Number.isFinite(postId) ? postId : undefined,
    { limit: rowsPerPage, skip }
  );

  const rows = data?.comments || [];
  const pages = data ? Math.ceil(data.total / rowsPerPage) : 1;

  const header = useMemo(() => {
    if (!Number.isFinite(postId)) return "Комментарии к посту";
    return `Комментарии к посту #${postId}`;
  }, [postId]);

  const subtitle = useMemo(() => {
    const first = rows?.[0] as any;
    const title =
      first?.post?.title ||
      first?.postTitle ||
      first?.post?.name ||
      first?.postName ||
      "";
    return title || "Просмотр и модерация комментариев";
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c: any) =>
      String(c.body || "")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  if (error) {
    return <div className="text-red-600 p-4">Ошибка загрузки комментариев</div>;
  }

  return (
    <div className="bg-[#E6F1FE] min-h-[calc(100vh-0px)]">
      <div className="mx-auto w-full max-w-[1472px] px-0 lg:px-20 py-0">
        <div className="px-5 lg:px-0 pt-6 lg:pt-0">
          <Button
            variant="light"
            className="px-0 h-5 min-w-0 text-[12px] leading-4 font-normal text-[#52525B]"
            onPress={() => router.push("/dashboard/posts")}
          >
            ← Назад к постам
          </Button>
        </div>

        <div className="px-5 lg:px-0 mt-3 lg:mt-10 flex flex-col items-start gap-3 lg:gap-5">
          <h1 className="text-[20px] leading-7 lg:text-[36px] lg:leading-10 font-semibold text-[#11181C]">
            {header}
          </h1>
          <p className="text-[14px] leading-5 lg:text-[18px] lg:leading-7 font-normal text-[#3F3F46]">
            {subtitle}
          </p>

          <AppSearchInput
            placeholder="Поиск по комментариям"
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            className="w-full max-w-[746px] lg:max-w-[746px]"
          />
        </div>

        <div className="mt-5 lg:mt-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="lg:hidden px-[2px]">
                <div className="rounded-t-[16px] overflow-hidden">
                  {filteredRows.length ? (
                    filteredRows.map((c: any) => {
                      const u = c.user;
                      const name = authorShort(u);
                      return (
                        <div
                          key={c.id}
                          className="box-border flex flex-col items-start p-3 gap-1 bg-white border-b border-[#E4E4E7]"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={u?.image}
                              name={name !== "-" ? name : "User"}
                              className="w-5 h-5 shrink-0"
                            />
                            <span className="text-[14px] leading-5 font-normal text-[#27272A] truncate">
                              {name}
                            </span>
                          </div>

                          <div className="w-full text-[14px] leading-5 font-normal text-[#27272A] whitespace-pre-wrap break-words">
                            {c.body || "-"}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 bg-white text-[14px] leading-5 font-normal text-[#52525B]">
                      Комментарии не найдены
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden lg:block bg-white rounded-[16px] p-3">
                <AppTable
                  ariaLabel="Comments table"
                  className="w-full table-fixed"
                >
                  <TableHeader>
                    <TableColumn key="body">Комментарий</TableColumn>
                    <TableColumn key="author" className="w-[220px]">
                      Автор
                    </TableColumn>
                  </TableHeader>

                  <TableBody
                    items={filteredRows}
                    emptyContent="Комментарии не найдены"
                  >
                    {(c: any) => {
                      const u = c.user;
                      const name = authorShort(u);
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="py-4">
                            <div className="text-[16px] leading-6 font-normal whitespace-pre-wrap break-words">
                              {c.body || "-"}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={u?.image}
                                name={name !== "-" ? name : "User"}
                                className="w-6 h-6 shrink-0"
                              />
                              <span className="text-[16px] leading-6 font-normal text-[#27272A] truncate">
                                {name}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }}
                  </TableBody>
                </AppTable>

                <AppPagination
                  page={page}
                  totalPages={pages}
                  onChange={setPage}
                  pageSize={rowsPerPage}
                  pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                  onPageSizeChange={(v) => {
                    setRowsPerPage(v);
                    setPage(1);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
