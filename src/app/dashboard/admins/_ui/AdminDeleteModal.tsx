"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { getFullName } from "../_model/mappers";

export function AdminDeleteModal({
  isOpen,
  onOpenChange,
  isSubmitting,
  user,
  onConfirm,
}: any) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="opaque"
      isDismissable
      hideCloseButton={false}
      placement="center"
    >
      <ModalContent>
        {(onClose) => {
          const name = user ? getFullName(user as any) : "";
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
                  onPress={() => onConfirm(onClose)}
                  isLoading={isSubmitting}
                  isDisabled={!user}
                >
                  Удалить
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
