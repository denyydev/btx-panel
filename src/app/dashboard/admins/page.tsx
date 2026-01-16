"use client";

import type { User } from "@/shared/api/users.service";
import {
  useAdminsQuery,
  useCreateAdmin,
  useDeleteAdmin,
  useUpdateAdmin,
} from "@/shared/hooks/useAdmins";
import { useSocket } from "@/shared/hooks/useSocket";
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
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

type Role = "admin" | "user" | "moderator";

const formatBirth = (value: unknown) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const now = new Date();
  let age = now.getFullYear() - yyyy;
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return `${dd}.${mm}.${yyyy} (${age}лет)`;
};

const genderLabel = (v: unknown) => {
  if (!v) return "-";
  const s = String(v).toLowerCase();
  if (["m", "male", "man", "м", "муж", "мужской"].includes(s)) return "Мужской";
  if (["f", "female", "woman", "ж", "жен", "женский"].includes(s))
    return "Женский";
  return String(v);
};

const toIsoDateInput = (value: unknown) => {
  if (!value) return "";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

function AdminMobileRow({
  u,
  onEdit,
  onDelete,
}: {
  u: any;
  onEdit: (u: any) => void;
  onDelete: (u: any) => void;
}) {
  const fullName =
    u?.name || [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim();

  const birth = formatBirth(u?.birthDate);
  const birthDate = birth.split(" ")[0];
  const birthAge = birth.match(/\((.*?)\)/)?.[0] ?? "";

  return (
    <div className="bg-white border-b border-[#E4E4E7] px-5 py-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Avatar
                src={u?.image}
                name={fullName || "User"}
                className="w-5 h-5"
              />
              <div className="text-[16px] leading-6 font-semibold text-[#27272A] truncate">
                {fullName || "-"}
              </div>
            </div>

            <div className="mt-2 text-[14px] leading-5 font-normal text-[#338EF7] truncate">
              {u?.email ? (
                <a href={`mailto:${u.email}`} className="hover:underline">
                  {u.email}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                className="w-6 h-6 p-0 bg-transparent"
              >
                ⋯
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem onPress={() => onEdit(u)}>
                Редактировать
              </DropdownItem>
              <DropdownItem
                className="text-danger"
                color="danger"
                onPress={() => onDelete(u)}
              >
                Удалить
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex items-start gap-2">
          <div className="w-[170px]">
            <div className="text-[12px] leading-4 font-normal text-[#52525B]">
              Дата рождения
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-[14px] leading-5 font-normal text-[#27272A]">
                {birthDate}
              </div>
              <div className="text-[14px] leading-5 font-normal text-[#52525B]">
                {birthAge}
              </div>
            </div>
          </div>

          <div className="w-[64px]">
            <div className="text-[12px] leading-4 font-normal text-[#52525B]">
              Пол
            </div>
            <div className="text-[14px] leading-5 font-normal text-[#27272A]">
              {genderLabel(u?.gender)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminsPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>({ column: "name", direction: "asc" });

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    birthDate: string;
    role: Role;
  }>({ name: "", email: "", birthDate: "", role: "admin" });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    birthDate?: string;
  }>({});

  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const socket = useSocket();
  const queryClient = useQueryClient();

  const skip = (page - 1) * rowsPerPage;

  const sort = useMemo(() => {
    return sortDescriptor.column
      ? `${sortDescriptor.column}:${sortDescriptor.direction}`
      : undefined;
  }, [sortDescriptor]);

  const adminsQ = useAdminsQuery({
    limit: rowsPerPage,
    skip,
    search: search || undefined,
    sort,
  });

  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  useEffect(() => {
    if (!socket) return;

    const handleUserChanged = (payload: { type: string; message: string }) => {
      setToastMessage({ message: payload.message, type: "success" });
      setTimeout(() => setToastMessage(null), 3000);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    };

    socket.on("user:changed", handleUserChanged);

    return () => {
      socket.off("user:changed", handleUserChanged);
    };
  }, [socket, queryClient]);

  const validateForm = () => {
    const errors: { name?: string; email?: string; birthDate?: string } = {};
    if (!formData.name.trim()) errors.name = "ФИО обязательно";
    if (!formData.email.trim()) {
      errors.email = "Email обязателен";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        errors.email = "Неверный формат email";
    }
    if (!formData.birthDate.trim())
      errors.birthDate = "Дата рождения обязательна";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", birthDate: "", role: "admin" });
    setFormErrors({});
    setSelectedUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    onCreateOpen();
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    const anyUser = user as any;
    const name =
      anyUser?.name ||
      [anyUser?.firstName, anyUser?.lastName].filter(Boolean).join(" ").trim();
    setFormData({
      name: name || "",
      email: anyUser?.email || "",
      birthDate: toIsoDateInput(anyUser?.birthDate),
      role: "admin",
    });
    setFormErrors({});
    onEditOpen();
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleCreate = async (close: () => void) => {
    if (!validateForm()) return;

    try {
      await createAdmin.mutateAsync({
        name: formData.name,
        email: formData.email,
        birthDate: formData.birthDate,
        role: "admin",
      } as any);

      socket?.emit("user:changed", {
        type: "create",
        message: `Администратор ${formData.name} создан`,
      });

      close();
      resetForm();
    } catch {
      setToastMessage({
        message: "Не удалось создать администратора",
        type: "error",
      });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleEdit = async (close: () => void) => {
    if (!selectedUser || !validateForm()) return;

    try {
      await updateAdmin.mutateAsync({
        id: (selectedUser as any).id,
        data: {
          name: formData.name,
          email: formData.email,
          birthDate: formData.birthDate,
          role: "admin",
        } as any,
      });

      socket?.emit("user:changed", {
        type: "update",
        message: `Администратор ${formData.name} обновлен`,
      });

      close();
      resetForm();
    } catch {
      setToastMessage({
        message: "Не удалось обновить администратора",
        type: "error",
      });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleDelete = async (close: () => void) => {
    if (!selectedUser) return;

    try {
      await deleteAdmin.mutateAsync((selectedUser as any).id);

      const anyUser = selectedUser as any;
      const name =
        anyUser?.name ||
        [anyUser?.firstName, anyUser?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();

      socket?.emit("user:changed", {
        type: "delete",
        message: `Администратор ${name || ""} удален`,
      });

      close();
      setSelectedUser(null);
    } catch {
      setToastMessage({
        message: "Не удалось удалить администратора",
        type: "error",
      });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const pages = adminsQ.data
    ? Math.ceil((adminsQ.data as any).total / rowsPerPage)
    : 1;
  const rows =
    (adminsQ.data as any)?.users || (adminsQ.data as any)?.data || [];

  if (adminsQ.error) {
    return (
      <div className="text-red-600 p-4">Ошибка загрузки администраторов</div>
    );
  }

  const avatarSrcCreate = "";
  const avatarNameCreate = (formData.name || "User").trim();
  const avatarSrcEdit = (selectedUser as any)?.image || "";
  const avatarNameEdit = (formData.name || "User").trim();

  return (
    <>
      <div className="space-y-6">
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              toastMessage.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toastMessage.message}
          </div>
        )}

        {/* MOBILE */}
        <div className="lg:hidden">
          <div className="px-5 pt-5 pb-4">
            <h1 className="text-[20px] leading-7 font-semibold text-[#11181C]">
              Администраторы
            </h1>
            <p className="mt-1 text-[14px] leading-5 font-normal text-[#3F3F46]">
              Управление администраторами системы
            </p>

            <Button
              color="primary"
              className="mt-3 w-full h-10 rounded-[12px] text-[14px] leading-5 font-normal"
              onPress={openCreateModal}
            >
              Добавить администратора
            </Button>

            <div className="mt-5">
              <AppSearchInput
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                className="w-full"
              />
            </div>
          </div>

          {adminsQ.isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="pb-[80px]">
              {rows.length ? (
                rows.map((u: any) => (
                  <AdminMobileRow
                    key={u.id}
                    u={u}
                    onEdit={(x) => openEditModal(x)}
                    onDelete={(x) => openDeleteModal(x)}
                  />
                ))
              ) : (
                <div className="px-5 py-6 text-[14px] text-[#52525B]">
                  Администраторы не найдены
                </div>
              )}
            </div>
          )}
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block space-y-6">
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
              onPress={openCreateModal}
            >
              Добавить администратора
            </Button>
          </div>

          <AppSearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            className="max-w-[746px]"
          />

          {adminsQ.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <AppTable
                aria-label="Admins table"
                className="table-fixed w-full"
                classNames={{
                  thead: "bg-[#FAFAFA]",
                  th: "h-[44px] bg-[#FAFAFA] text-[14px] leading-5 font-semibold text-[#71717A] px-6",
                  td: "h-[64px] px-6 border-b border-[#E4E4E7] text-[#27272A]",
                  tr: "transition-colors hover:bg-[#FAFAFA]",
                }}
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
                  <TableColumn key="actions" className="w-[40px]" />
                </TableHeader>

                <TableBody emptyContent="Администраторы не найдены">
                  {rows.map((u: any) => {
                    const fullName =
                      u?.name ||
                      [u?.firstName, u?.lastName]
                        .filter(Boolean)
                        .join(" ")
                        .trim();

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
                                <DropdownItem onPress={() => openEditModal(u)}>
                                  Редактировать
                                </DropdownItem>
                                <DropdownItem
                                  className="text-danger"
                                  color="danger"
                                  onPress={() => openDeleteModal(u)}
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
                pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                onPageSizeChange={(v) => {
                  setRowsPerPage(v);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isCreateOpen}
        onOpenChange={onCreateOpenChange}
        size="lg"
        backdrop="opaque"
        isDismissable
        hideCloseButton={false}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Добавить администратора</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-4">
                  <Avatar
                    src={avatarSrcCreate}
                    name={avatarNameCreate || "User"}
                    className="w-20 h-20"
                  />
                  <div className="w-full space-y-3">
                    <Input
                      label="ФИО"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, name: e.target.value }));
                        setFormErrors((p) => ({ ...p, name: undefined }));
                      }}
                      isInvalid={!!formErrors.name}
                      errorMessage={formErrors.name}
                      variant="bordered"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, email: e.target.value }));
                        setFormErrors((p) => ({ ...p, email: undefined }));
                      }}
                      isInvalid={!!formErrors.email}
                      errorMessage={formErrors.email}
                      variant="bordered"
                    />
                    <Input
                      label="Дата рождения"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          birthDate: e.target.value,
                        }));
                        setFormErrors((p) => ({ ...p, birthDate: undefined }));
                      }}
                      isInvalid={!!formErrors.birthDate}
                      errorMessage={formErrors.birthDate}
                      variant="bordered"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleCreate(onClose)}
                  isLoading={createAdmin.isPending}
                >
                  Создать
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        size="lg"
        backdrop="opaque"
        isDismissable
        hideCloseButton={false}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Редактировать администратора</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-4">
                  <Avatar
                    src={avatarSrcEdit}
                    name={avatarNameEdit || "User"}
                    className="w-20 h-20"
                  />
                  <div className="w-full space-y-3">
                    <Input
                      label="ФИО"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, name: e.target.value }));
                        setFormErrors((p) => ({ ...p, name: undefined }));
                      }}
                      isInvalid={!!formErrors.name}
                      errorMessage={formErrors.name}
                      variant="bordered"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, email: e.target.value }));
                        setFormErrors((p) => ({ ...p, email: undefined }));
                      }}
                      isInvalid={!!formErrors.email}
                      errorMessage={formErrors.email}
                      variant="bordered"
                    />
                    <Input
                      label="Дата рождения"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          birthDate: e.target.value,
                        }));
                        setFormErrors((p) => ({ ...p, birthDate: undefined }));
                      }}
                      isInvalid={!!formErrors.birthDate}
                      errorMessage={formErrors.birthDate}
                      variant="bordered"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleEdit(onClose)}
                  isLoading={updateAdmin.isPending}
                >
                  Сохранить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        backdrop="opaque"
        isDismissable
        hideCloseButton={false}
        placement="center"
      >
        <ModalContent>
          {(onClose) => {
            const anyUser = selectedUser as any;
            const name =
              anyUser?.name ||
              [anyUser?.firstName, anyUser?.lastName]
                .filter(Boolean)
                .join(" ")
                .trim();
            return (
              <>
                <ModalHeader>Удалить администратора</ModalHeader>
                <ModalBody>
                  <p>
                    Вы уверены, что хотите удалить администратора{" "}
                    <strong>{name}</strong>? Это действие нельзя отменить.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Отмена
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => handleDelete(onClose)}
                    isLoading={deleteAdmin.isPending}
                  >
                    Удалить
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
}
