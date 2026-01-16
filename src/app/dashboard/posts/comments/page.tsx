"use client";

import { usePostCommentsQuery } from "@/shared/hooks/usePosts";
import { AppPagination } from "@/shared/ui/AppPagination/AppPagination";
import {
  Avatar,
  Button,
  Select,
  SelectItem,
  Spinner,
  Table,
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

  const skip = (page - 1) * rowsPerPage;

  const { data, isLoading, error } = usePostCommentsQuery(
    Number.isFinite(postId) ? postId : undefined,
    { limit: rowsPerPage, skip }
  );

  const rows = data?.comments || [];
  const pages = data ? Math.ceil(data.total / rowsPerPage) : 1;

  const header = useMemo(() => {
    if (!Number.isFinite(postId)) return "Комментарии";
    return `Комментарии поста #${postId}`;
  }, [postId]);

  if (error)
    return <div className="text-red-600 p-4">Ошибка загрузки комментариев</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{header}</h2>
        <Button variant="flat" onPress={() => router.push("/posts")}>
          Назад к постам
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table aria-label="Comments table">
            <TableHeader>
              <TableColumn key="body">Комментарий</TableColumn>
              <TableColumn key="author">Автор</TableColumn>
            </TableHeader>

            <TableBody emptyContent="Комментарии не найдены">
              {rows.map((c: any) => {
                const u = c.user;
                const name = authorShort(u);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="max-w-2xl whitespace-pre-wrap">
                      {c.body || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={name !== "-" ? name : "User"}
                          className="shrink-0"
                        />
                        <span className="font-medium">{name}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <Select
              selectedKeys={[String(rowsPerPage)]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string | undefined;
                if (!value) return;
                setRowsPerPage(Number(value));
                setPage(1);
              }}
              className="w-32"
              variant="bordered"
            >
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={String(option)}>{option}</SelectItem>
              ))}
            </Select>
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
  );
}
