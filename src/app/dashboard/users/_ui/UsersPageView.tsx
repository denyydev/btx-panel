// src/app/dashboard/users/_ui/UsersPageView.tsx
"use client";

import { Spinner } from "@heroui/react";
import { UserDeleteModal } from "./UserDeleteModal";
import { UserFormModal } from "./UserFormModal";
import { UsersDesktopTable } from "./UsersDesktopTable";
import { UsersMobileList } from "./UsersMobileList";

export function UsersPageView(props: any) {
  const {
    query,
    toastMessage,
    modals,
    actions,
    formData,
    formErrors,
    mutation,
    avatars,
    selectedUser,
  } = props;

  if (query.error) {
    return (
      <div className="text-red-600 p-4">Ошибка загрузки пользователей</div>
    );
  }

  // если вообще нет данных — показываем спиннер
  if (query.isLoading && !query.data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div>
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

        <div className="lg:hidden">
          <UsersMobileList {...props} />
        </div>

        <div className="hidden lg:block">
          <UsersDesktopTable {...props} />
        </div>
      </div>

      <UserFormModal
        mode="create"
        isOpen={modals.create.isOpen}
        onOpenChange={modals.create.onOpenChange}
        title="Добавить пользователя"
        submitText="Создать"
        isSubmitting={mutation.createPending}
        avatarSrc={avatars.avatarSrcCreate}
        avatarName={avatars.avatarNameCreate}
        formData={formData}
        formErrors={formErrors}
        onChangeField={(key: string, value: string) => {
          props.setFormData((p: any) => ({ ...p, [key]: value }));
          props.setFormErrors((p: any) => ({ ...p, [key]: undefined }));
        }}
        onSubmit={actions.handleCreate}
      />

      <UserFormModal
        mode="edit"
        isOpen={modals.edit.isOpen}
        onOpenChange={modals.edit.onOpenChange}
        title="Редактировать пользователя"
        submitText="Сохранить"
        isSubmitting={mutation.updatePending}
        avatarSrc={avatars.avatarSrcEdit}
        avatarName={avatars.avatarNameEdit}
        formData={formData}
        formErrors={formErrors}
        onChangeField={(key: string, value: string) => {
          props.setFormData((p: any) => ({ ...p, [key]: value }));
          props.setFormErrors((p: any) => ({ ...p, [key]: undefined }));
        }}
        onSubmit={actions.handleEdit}
        disabled={!selectedUser}
      />

      <UserDeleteModal
        isOpen={modals.remove.isOpen}
        onOpenChange={modals.remove.onOpenChange}
        isSubmitting={mutation.deletePending}
        user={selectedUser}
        onConfirm={actions.handleDelete}
      />
    </>
  );
}
