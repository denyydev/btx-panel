"use client";

import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

export function AdminFormModal({
  mode,
  isOpen,
  onOpenChange,
  title,
  submitText,
  isSubmitting,
  avatarSrc,
  avatarName,
  formData,
  formErrors,
  onChangeField,
  onSubmit,
  disabled,
}: any) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      backdrop="opaque"
      isDismissable
      hideCloseButton={false}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  src={avatarSrc}
                  name={avatarName || "User"}
                  className="w-20 h-20"
                />
                <div className="w-full space-y-3">
                  <Input
                    label="ФИО"
                    value={formData.name}
                    onChange={(e) => onChangeField("name", e.target.value)}
                    isInvalid={!!formErrors.name}
                    errorMessage={formErrors.name}
                    variant="bordered"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => onChangeField("email", e.target.value)}
                    isInvalid={!!formErrors.email}
                    errorMessage={formErrors.email}
                    variant="bordered"
                  />
                  <Input
                    label="Дата рождения"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => onChangeField("birthDate", e.target.value)}
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
                onPress={() => onSubmit(onClose)}
                isLoading={isSubmitting}
                isDisabled={!!disabled}
              >
                {submitText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
