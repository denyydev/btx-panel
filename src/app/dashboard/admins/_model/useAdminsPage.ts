// src/app/dashboard/admins/_model/useAdminsPage.ts
"use client";

import type { User } from "@/shared/api/users.service";
import {
  useAdminsQuery,
  useCreateAdmin,
  useDeleteAdmin,
  useUpdateAdmin,
} from "@/shared/hooks/useAdmins";
import { useSocket } from "@/shared/hooks/useSocket";
import { useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  getFullName,
  getRowsFromAdminsResponse,
  getTotalFromAdminsResponse,
  toIsoDateInput,
} from "./mappers";
import type {
  AdminEntity,
  AdminFormData,
  AdminFormErrors,
  SortDescriptor,
  ToastMessage,
} from "./types";
import { validateAdminForm } from "./validators";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export function useAdminsPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState("");
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

  const [formData, setFormData] = useState<AdminFormData>({
    name: "",
    email: "",
    birthDate: "",
    role: "admin",
  });

  const [formErrors, setFormErrors] = useState<AdminFormErrors>({});

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

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

    const handleAdminsChanged = (payload: {
      type: string;
      message: string;
    }) => {
      setToastMessage({ message: payload.message, type: "success" });
      setTimeout(() => setToastMessage(null), 3000);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    };

    socket.on("admins:changed", handleAdminsChanged);

    return () => {
      socket.off("admins:changed", handleAdminsChanged);
    };
  }, [socket, queryClient]);

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
    const name = getFullName(anyUser);
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

  const validateForm = () => {
    const errors = validateAdminForm(formData);
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
      await createAdmin.mutateAsync({
        name: formData.name,
        email: formData.email,
        birthDate: formData.birthDate,
        role: "admin",
      } as any);

      socket?.emit("admins:create", {
        type: "create",
        message: `Администратор ${formData.name} создан`,
      });

      close();
      resetForm();
    } catch {
      showErrorToast("Не удалось создать администратора");
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

      socket?.emit("admins:update", {
        type: "update",
        message: `Администратор ${formData.name} обновлен`,
      });

      close();
      resetForm();
    } catch {
      showErrorToast("Не удалось обновить администратора");
    }
  };

  const handleDelete = async (close: () => void) => {
    if (!selectedUser) return;

    try {
      await deleteAdmin.mutateAsync((selectedUser as any).id);

      const anyUser = selectedUser as any;
      const name = getFullName(anyUser);

      socket?.emit("admins:delete", {
        type: "delete",
        message: `Администратор ${name || ""} удален`,
      });

      close();
      setSelectedUser(null);
    } catch {
      showErrorToast("Не удалось удалить администратора");
    }
  };

  const rows = getRowsFromAdminsResponse(adminsQ.data) as AdminEntity[];
  const total = getTotalFromAdminsResponse(adminsQ.data);
  const pages = total ? Math.ceil(total / rowsPerPage) : 1;

  const onSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const onPageSizeChange = (v: number) => {
    setRowsPerPage(v);
    setPage(1);
  };

  const avatarSrcCreate = "";
  const avatarNameCreate = (formData.name || "User").trim();
  const avatarSrcEdit = (selectedUser as any)?.image || "";
  const avatarNameEdit = (formData.name || "User").trim();

  return {
    query: adminsQ,
    rows,
    total,
    pages,
    page,
    setPage,
    rowsPerPage,
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS as readonly number[],
    onPageSizeChange,
    search,
    onSearchChange,
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
      createPending: createAdmin.isPending,
      updatePending: updateAdmin.isPending,
      deletePending: deleteAdmin.isPending,
    },
    avatars: {
      avatarSrcCreate,
      avatarNameCreate,
      avatarSrcEdit,
      avatarNameEdit,
    },
  };
}
