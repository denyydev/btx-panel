// src/app/dashboard/users/_ui/UsersDesktopTable.tsx
"use client";

import { AppPagination } from "@/shared/ui/AppPagination/AppPagination";
import { AppSearchInput } from "@/shared/ui/AppSearchInput/AppSearchInput";
import { AppTable } from "@/shared/ui/AppTable/AppTable";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  formatBirth,
  genderLabel,
  getFullName,
  roleColor,
  roleLabel,
  toNumberOrDash,
} from "../_model/mappers";

export function UsersDesktopTable(props: any) {
  const {
    rows,
    pages,
    page,
    setPage,
    rowsPerPage,
    rowsPerPageOptions,
    onPageSizeChange,
    search,
    onSearchChange,
    actions,
  } = props;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-[36px] leading-10 font-semibold text-[#11181C]">
            Пользователи
          </h1>
          <p className="text-[18px] leading-7 font-normal text-[#3F3F46]">
            Управление пользователями системы
          </p>
        </div>

        <Button
          color="primary"
          className="h-12 px-6 rounded-[12px] text-[16px] leading-6 font-normal shrink-0"
          onPress={actions.openCreateModal}
        >
          Добавить пользователя
        </Button>
      </div>

      <AppSearchInput
        value={search}
        onChange={onSearchChange}
        className="max-w-[746px]"
      />

      <AppTable
        aria-label="Users table"
        className="w-full table-auto"
        classNames={{
          thead: "bg-[#FAFAFA]",
          th: "h-[44px] bg-[#FAFAFA] px-6 text-[14px] leading-5 font-semibold text-[#71717A] whitespace-nowrap",
          td: "h-[64px] px-6 border-b border-[#E4E4E7] text-[16px] leading-6 font-normal text-[#27272A]",
          tr: "transition-colors hover:bg-[#FAFAFA]",
        }}
      >
        <TableHeader>
          <TableColumn key="user">Пользователь</TableColumn>
          <TableColumn key="email">Email</TableColumn>
          <TableColumn key="birthDate">Дата рождения</TableColumn>
          <TableColumn key="gender">Пол</TableColumn>
          <TableColumn key="posts" className="text-center">
            Посты
          </TableColumn>
          <TableColumn key="likes" className="text-center">
            Лайки
          </TableColumn>
          <TableColumn key="comments" className="text-center">
            Комментарии
          </TableColumn>
          <TableColumn key="role" className="text-center">
            Роль
          </TableColumn>
          <TableColumn key="actions" className="w-0">
            <span className="sr-only">Действия</span>
          </TableColumn>
        </TableHeader>

        <TableBody emptyContent="Пользователи не найдены">
          {rows.map((u: any) => {
            const fullName = getFullName(u);
            const posts = toNumberOrDash(u?.postCount);
            const likes = toNumberOrDash(u?.likeCount);
            const comments = toNumberOrDash(u?.commentCount);
            const birth = formatBirth(u?.birthDate);
            const birthDate = birth.split(" ")[0];
            const birthAge = birth.match(/\((.*?)\)/)?.[0] ?? "";

            return (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar
                      src={u?.image}
                      name={fullName || "User"}
                      className="w-6 h-6 shrink-0"
                    />
                    <span className="min-w-0 truncate text-[16px] leading-6 font-semibold text-[#27272A]">
                      {fullName || "-"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="min-w-0 truncate">
                    {u?.email ? (
                      <a
                        href={`mailto:${u.email}`}
                        className="text-[16px] leading-6 font-normal text-[#338EF7] hover:underline"
                      >
                        {u.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="text-[16px] leading-6 font-normal text-[#27272A]">
                      {birthDate}
                    </span>
                    <span className="text-[14px] leading-5 font-normal text-[#52525B]">
                      {birthAge}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="whitespace-nowrap">
                    {genderLabel(u?.gender)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-center tabular-nums whitespace-nowrap">
                    {posts}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-center tabular-nums whitespace-nowrap">
                    {likes}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-center tabular-nums whitespace-nowrap">
                    {comments}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <Chip color={roleColor(u?.role)} variant="flat" size="sm">
                      {roleLabel(u?.role)}
                    </Chip>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end whitespace-nowrap">
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          className="w-10 h-10 rounded-[12px] bg-transparent data-[hover=true]:bg-[#E4E4E7]"
                          variant="light"
                        >
                          ⋯
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem onPress={() => actions.openEditModal(u)}>
                          Редактировать
                        </DropdownItem>
                        <DropdownItem
                          className="text-danger"
                          color="danger"
                          onPress={() => actions.openDeleteModal(u)}
                        >
                          Удалить
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </AppTable>

      <AppPagination
        page={page}
        totalPages={pages}
        onChange={setPage}
        pageSize={rowsPerPage}
        pageSizeOptions={rowsPerPageOptions}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
