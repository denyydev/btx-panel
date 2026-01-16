"use client";

import type { User } from "@/shared/api/users.service";
import { useSocket } from "@/shared/hooks/useSocket";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsersWithMetricsQuery,
} from "@/shared/hooks/useUsers";
import { useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  getFullName,
  getRowsFromUsersResponse,
  getTotalFromUsersResponse,
  toIsoDateInput,
} from "./mappers";
import type {
  SortDescriptor,
  ToastMessage,
  UserEntity,
  UserFormData,
  UserFormErrors,
} from "./types";
import { validateUserForm } from "./validators";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export function useUsersPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "asc",
  });

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

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    birthDate: "",
    role: "user",
  });

  const [formErrors, setFormErrors] = useState<UserFormErrors>({});

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const socket = useSocket();
  const queryClient = useQueryClient();

  const skip = (page - 1) * rowsPerPage;

  const sort = useMemo(() => {
    return sortDescriptor.column
      ? `${sortDescriptor.column}:${sortDescriptor.direction}`
      : undefined;
  }, [sortDescriptor]);

  const usersQ = useUsersWithMetricsQuery({
    limit: rowsPerPage,
    skip,
    sort,
  } as any);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  useEffect(() => {
    if (!socket) return;

    const handleUsersChanged = (payload: { type: string; message: string }) => {
      setToastMessage({ message: payload.message, type: "success" });
      setTimeout(() => setToastMessage(null), 3000);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "metrics"] });
    };

    socket.on("users:changed", handleUsersChanged);

    return () => {
      socket.off("users:changed", handleUsersChanged);
    };
  }, [socket, queryClient]);

  const resetForm = () => {
    setFormData({ name: "", email: "", birthDate: "", role: "user" });
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
    setFormData({
      name: getFullName(anyUser) || "",
      email: anyUser?.email || "",
      birthDate: toIsoDateInput(anyUser?.birthDate),
      role: (anyUser?.role || "user") as any,
    });
    setFormErrors({});
    onEditOpen();
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const validateForm = () => {
    const errors = validateUserForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showErrorToast = (message: string) => {
    setToastMessage({ message, type: "error" });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreate = async (close: () => void) => {
    if (!validateForm()) return;

    try {
      await createUser.mutateAsync({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        birthDate: formData.birthDate,
      } as any);

      socket?.emit("users:create", {
        type: "create",
        message: `Пользователь ${formData.name} создан`,
      });

      close();
      resetForm();
    } catch {
      showErrorToast("Не удалось создать пользователя");
    }
  };

  const handleEdit = async (close: () => void) => {
    if (!selectedUser || !validateForm()) return;

    try {
      await updateUser.mutateAsync({
        id: (selectedUser as any).id,
        data: {
          name: formData.name,
          email: formData.email,
          birthDate: formData.birthDate,
          role: formData.role,
        } as any,
      });

      socket?.emit("users:update", {
        type: "update",
        message: `Пользователь ${formData.name} обновлен`,
      });

      close();
      resetForm();
    } catch {
      showErrorToast("Не удалось обновить пользователя");
    }
  };

  const handleDelete = async (close: () => void) => {
    if (!selectedUser) return;

    try {
      await deleteUser.mutateAsync((selectedUser as any).id);

      const anyUser = selectedUser as any;
      const name = getFullName(anyUser);

      socket?.emit("users:delete", {
        type: "delete",
        message: `Пользователь ${name || ""} удален`,
      });

      close();
      setSelectedUser(null);
    } catch {
      showErrorToast("Не удалось удалить пользователя");
    }
  };

  const rows = getRowsFromUsersResponse(usersQ.data) as UserEntity[];
  const total = getTotalFromUsersResponse(usersQ.data);
  const pages = total ? Math.ceil(total / rowsPerPage) : 1;

  const onPageSizeChange = (v: number) => {
    setRowsPerPage(v);
    setPage(1);
  };

  const avatarSrcCreate = "";
  const avatarNameCreate = (formData.name || "User").trim();
  const avatarSrcEdit = (selectedUser as any)?.image || "";
  const avatarNameEdit = (formData.name || "User").trim();

  return {
    query: usersQ,
    rows,
    total,
    pages,
    page,
    setPage,
    rowsPerPage,
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS as readonly number[],
    onPageSizeChange,
    sortDescriptor,
    setSortDescriptor,
    selectedUser,
    setSelectedUser,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    toastMessage,
    setToastMessage,
    modals: {
      create: { isOpen: isCreateOpen, onOpenChange: onCreateOpenChange },
      edit: { isOpen: isEditOpen, onOpenChange: onEditOpenChange },
      remove: { isOpen: isDeleteOpen, onOpenChange: onDeleteOpenChange },
    },
    actions: {
      openCreateModal,
      openEditModal,
      openDeleteModal,
      handleCreate,
      handleEdit,
      handleDelete,
      resetForm,
    },
    mutation: {
      createPending: createUser.isPending,
      updatePending: updateUser.isPending,
      deletePending: deleteUser.isPending,
    },
    avatars: {
      avatarSrcCreate,
      avatarNameCreate,
      avatarSrcEdit,
      avatarNameEdit,
    },
  };
}
