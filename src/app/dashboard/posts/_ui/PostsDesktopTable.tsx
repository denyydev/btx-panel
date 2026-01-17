"use client";

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
import { authorShort } from "../_model/utils";

export function PostsDesktopTable(props: any) {
  const { rows, commentsMap, isRefetching, onSort, sortIcon, goToComments } =
    props;

  return (
    <div className="relative">
      <AppTable ariaLabel="Posts table">
        <TableHeader>
          <TableColumn key="id">
            <button
              type="button"
              className="inline-flex items-center gap-2"
              onClick={() => onSort("id")}
            >
              ID <span className="text-xs opacity-70">{sortIcon("id")}</span>
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
              <span className="text-xs opacity-70">{sortIcon("views")}</span>
            </button>
          </TableColumn>

          <TableColumn key="likes">
            <button
              type="button"
              className="inline-flex items-center gap-2"
              onClick={() => onSort("likes")}
            >
              Лайки{" "}
              <span className="text-xs opacity-70">{sortIcon("likes")}</span>
            </button>
          </TableColumn>

          <TableColumn key="comments">
            <button
              type="button"
              className="inline-flex items-center gap-2"
              onClick={() => onSort("comments")}
            >
              Комментарии{" "}
              <span className="text-xs opacity-70">{sortIcon("comments")}</span>
            </button>
          </TableColumn>

          <TableColumn key="actions" className="w-12">
            Действия
          </TableColumn>
        </TableHeader>

        <TableBody items={rows} emptyContent="Посты не найдены">
          {(p: any) => {
            const u = p.user;
            const name = authorShort(u);
            const author = name !== "-" ? name : `User ${p.userId}`;
            const commentsCount = commentsMap[String(p.id)];

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
                    <Avatar src={u?.image} name={author} className="shrink-0" />
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
                    onPress={() => goToComments(p.id)}
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
  );
}
