"use client";
import { AppPagination } from "@/shared/ui/AppPagination/AppPagination";
import { AppSearchInput } from "@/shared/ui/AppSearchInput/AppSearchInput";
import { AppTable } from "@/shared/ui/AppTable/AppTable";
import {
  Avatar,
  Button,
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
import { PlusCircle } from "lucide-react";
import { formatBirth, genderLabel, getFullName } from "../_model/mappers";

export function AdminsDesktopTable(props: any) {
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
            Администраторы
          </h1>
          <p className="text-[18px] leading-7 font-normal text-[#3F3F46]">
            Управление администраторами системы
          </p>
        </div>

        <Button
          color="primary"
          className="h-12 px-6 rounded-[12px] text-[16px] leading-6 font-normal"
          onPress={actions.openCreateModal}
          startContent={<PlusCircle size={18} strokeWidth={1.75} />}
        >
          Добавить администратора
        </Button>
      </div>

      <AppSearchInput
        value={search}
        onChange={onSearchChange}
        className="max-w-[746px]"
      />

      <AppTable
        ariaLabel="Admins table"
        className="table-fixed w-full"
      >
        <TableHeader>
          <TableColumn key="name" className="w-[594px]">
            Пользователь
          </TableColumn>
          <TableColumn key="email" className="w-[240px]">
            Email
          </TableColumn>
          <TableColumn key="birthDate" className="w-[150px]">
            Дата рождения
          </TableColumn>
          <TableColumn key="gender" className="w-[80px]">
            Пол
          </TableColumn>
          <TableColumn key="actions" className="w-[40px]">Действия</TableColumn>
        </TableHeader>

        <TableBody emptyContent="Администраторы не найдены">
          {rows.map((u: any) => {
            const fullName = getFullName(u);
            const birth = formatBirth(u?.birthDate);

            return (
              <TableRow
                key={u.id}
                className="transition-colors hover:bg-[#FAFAFA]"
              >
                <TableCell>
                  <div className="flex items-center gap-2 w-[594px]">
                    <Avatar
                      src={u?.image}
                      name={fullName || "User"}
                      className="w-6 h-6"
                    />
                    <span className="text-[16px] leading-6 font-semibold text-[#27272A] truncate">
                      {fullName || "-"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="w-[240px] truncate">
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
                  <div className="w-[150px] flex items-baseline gap-1">
                    <span className="text-[16px] leading-6 font-normal text-[#27272A]">
                      {birth.split(" ")[0]}
                    </span>
                    <span className="text-[14px] leading-5 font-normal text-[#52525B]">
                      {birth.match(/\((.*?)\)/)?.[0] ?? ""}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="w-[80px] text-[16px] leading-6 font-normal text-[#27272A]">
                    {genderLabel(u?.gender)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="w-[40px] flex justify-end">
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
                        <DropdownItem key="edit" onPress={() => actions.openEditModal(u)}>
                          Редактировать
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
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
