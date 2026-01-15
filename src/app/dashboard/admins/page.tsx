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
import {
  Avatar,
  Button,
  Chip,
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
  Select,
  SelectItem,
  Spinner,
  Table,
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

const roleLabel = (role: unknown) => {
  const r = String(role || "user");
  if (r === "admin") return "Администратор";
  if (r === "moderator") return "Модератор";
  return "Пользователь";
};

const roleColor = (role: unknown) => {
  const r = String(role || "user");
  if (r === "admin") return "primary" as const;
  if (r === "moderator") return "secondary" as const;
  return "default" as const;
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

        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Поиск по имени или email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
            variant="bordered"
          />
          <Button color="primary" onPress={openCreateModal}>
            Добавить администратора
          </Button>
        </div>

        {adminsQ.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <Table aria-label="Admins table">
              <TableHeader>
                <TableColumn
                  key="name"
                  className="cursor-pointer"
                  onClick={() => {
                    setSortDescriptor((prev) => ({
                      column: "name",
                      direction:
                        prev.column === "name" && prev.direction === "asc"
                          ? "desc"
                          : "asc",
                    }));
                  }}
                >
                  Пользователь{" "}
                  {sortDescriptor.column === "name" &&
                    (sortDescriptor.direction === "asc" ? "↑" : "↓")}
                </TableColumn>

                <TableColumn
                  key="email"
                  className="cursor-pointer"
                  onClick={() => {
                    setSortDescriptor((prev) => ({
                      column: "email",
                      direction:
                        prev.column === "email" && prev.direction === "asc"
                          ? "desc"
                          : "asc",
                    }));
                  }}
                >
                  Email{" "}
                  {sortDescriptor.column === "email" &&
                    (sortDescriptor.direction === "asc" ? "↑" : "↓")}
                </TableColumn>

                <TableColumn
                  key="birthDate"
                  className="cursor-pointer"
                  onClick={() => {
                    setSortDescriptor((prev) => ({
                      column: "birthDate",
                      direction:
                        prev.column === "birthDate" && prev.direction === "asc"
                          ? "desc"
                          : "asc",
                    }));
                  }}
                >
                  Дата рождения{" "}
                  {sortDescriptor.column === "birthDate" &&
                    (sortDescriptor.direction === "asc" ? "↑" : "↓")}
                </TableColumn>

                <TableColumn key="gender">Пол</TableColumn>
                <TableColumn key="role">Роль</TableColumn>
                <TableColumn key="actions" className="w-12" />
              </TableHeader>

              <TableBody emptyContent="Администраторы не найдены">
                {rows.map((u: any) => {
                  const fullName =
                    u?.name ||
                    [u?.firstName, u?.lastName]
                      .filter(Boolean)
                      .join(" ")
                      .trim();
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={u?.image}
                            name={fullName || "User"}
                            className="shrink-0"
                          />
                          <span className="font-medium">{fullName || "-"}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {u?.email ? (
                          <a
                            href={`mailto:${u.email}`}
                            className="text-primary hover:underline"
                          >
                            {u.email}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell>{formatBirth(u?.birthDate)}</TableCell>
                      <TableCell>{genderLabel(u?.gender)}</TableCell>

                      <TableCell>
                        <Chip
                          color={roleColor("admin")}
                          variant="flat"
                          size="sm"
                        >
                          {roleLabel("admin")}
                        </Chip>
                      </TableCell>

                      <TableCell>
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
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
                onPageSizeClick={() => {}}
              />
            </div>
          </>
        )}
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
