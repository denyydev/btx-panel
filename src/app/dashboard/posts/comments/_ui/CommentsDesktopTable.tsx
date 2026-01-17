"use client";

import { AppTable } from "@/shared/ui/AppTable/AppTable";
import {
  Avatar,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { authorShort } from "../_model/utils";

export function CommentsDesktopTable(props: any) {
  const { rows } = props;

  return (
    <AppTable ariaLabel="Comments table" className="w-full table-fixed">
      <TableHeader>
        <TableColumn key="body">Комментарий</TableColumn>
        <TableColumn key="author" className="w-[220px]">
          Автор
        </TableColumn>
      </TableHeader>

      <TableBody items={rows} emptyContent="Комментарии не найдены">
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
  );
}
