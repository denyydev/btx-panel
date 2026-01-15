"use client";

import { usePostsCommentsCounts, usePostsQuery } from "@/shared/hooks/usePosts";
import { useUsersQuery } from "@/shared/hooks/useUsers";
import {
  Avatar,
  Button,
  Pagination,
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
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

const authorShort = (u?: any) => {
  if (!u) return "-";
  const last = (u.lastName || "").trim();
  const first = (u.firstName || "").trim();
  return `${last} ${first ? first[0] + "." : ""}`.trim();
};

export default function PostsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const skip = (page - 1) * rowsPerPage;

  const postsQ = usePostsQuery({ limit: rowsPerPage, skip });
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

  const isLoading =
    postsQ.isLoading ||
    usersQ.isLoading ||
    commentsCountsQ.queries.some((q) => q.isLoading);

  if (postsQ.error)
    return <div className="text-red-600 p-4">Ошибка загрузки постов</div>;

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table aria-label="Posts table">
            <TableHeader>
              <TableColumn key="id">ID</TableColumn>
              <TableColumn key="author">Автор</TableColumn>
              <TableColumn key="views">Просмотры</TableColumn>
              <TableColumn key="likes">Лайки</TableColumn>
              <TableColumn key="comments">Комментарии</TableColumn>
              <TableColumn key="actions" className="w-12" />
            </TableHeader>

            <TableBody items={rowsWithAuthor} emptyContent="Посты не найдены">
              {(p: any) => {
                const u = p.user;
                const name = authorShort(u);
                const author = name !== "-" ? name : `User ${p.userId}`;
                const commentsCount = commentsCountsQ.map[String(p.id)];
                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>

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

            {pages > 1 && (
              <Pagination
                total={pages}
                page={page}
                onChange={setPage}
                showControls
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
