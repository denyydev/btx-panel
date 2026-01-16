"use client";

import { Spinner } from "@heroui/react";
import { AdminDeleteModal } from "./AdminDeleteModal";
import { AdminFormModal } from "./AdminFormModal";
import { AdminsDesktopTable } from "./AdminsDesktopTable";
import { AdminsMobileList } from "./AdminsMobileList";

export function AdminsPageView(props: any) {
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

  return (
    <>
      <div className="">
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
          {query.isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" />
            </div>
          ) : (
            <AdminsMobileList {...props} />
          )}
        </div>

        <div className="hidden lg:block">
          {query.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <AdminsDesktopTable {...props} />
          )}
        </div>
      </div>

      <AdminFormModal
        mode="create"
        isOpen={modals.create.isOpen}
        onOpenChange={modals.create.onOpenChange}
        title="Добавить администратора"
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

      <AdminFormModal
        mode="edit"
        isOpen={modals.edit.isOpen}
        onOpenChange={modals.edit.onOpenChange}
        title="Редактировать администратора"
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

      <AdminDeleteModal
        isOpen={modals.remove.isOpen}
        onOpenChange={modals.remove.onOpenChange}
        isSubmitting={mutation.deletePending}
        user={selectedUser}
        onConfirm={actions.handleDelete}
      />
    </>
  );
}
