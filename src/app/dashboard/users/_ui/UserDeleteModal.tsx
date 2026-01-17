// src/app/dashboard/users/_ui/UserDeleteModal.tsx
"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { X } from "lucide-react";
import { getFullName } from "../_model/mappers";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isSubmitting?: boolean;
  user?: any;
  onConfirm: (onClose: () => void) => void | Promise<void>;
};

export function UserDeleteModal({
  isOpen,
  onOpenChange,
  isSubmitting,
  user,
  onConfirm,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="opaque"
      isDismissable
      hideCloseButton
      placement="center"
      scrollBehavior="outside"
      classNames={{
        backdrop: "bg-black/50",
        wrapper: "overflow-hidden px-4",
        base: "overflow-hidden",
      }}
    >
      <ModalContent
        className={[
          "relative bg-white",
          "shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
          "rounded-[32px]",
          "w-[565px] max-w-[calc(100vw-32px)]",
          "h-[372px] max-h-[calc(100vh-32px)]",
          "overflow-hidden overflow-x-hidden",
          "flex flex-col items-center",
          "px-[60px] py-[60px] gap-[40px]",
        ].join(" ")}
      >
        {(onClose) => {
          const name = user ? getFullName(user as any) : "";

          return (
            <>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="absolute right-[30px] top-[30px] w-[32px] h-[32px] grid place-items-center rounded-full text-[#71717A] hover:bg-zinc-100 active:bg-zinc-200 transition"
              >
                <X className="w-[20px] h-[20px]" />
              </button>

              <ModalHeader className="p-0 w-full flex flex-col items-center">
                <h2 className="w-full max-w-[433px] h-[40px] font-semibold text-[36px] leading-[40px] text-[#11181C] flex items-center justify-center text-center">
                  Удаление пользователя
                </h2>
              </ModalHeader>

              <ModalBody className="p-0 w-full">
                <div className="w-full max-w-[445px] flex flex-col items-center gap-[20px]">
                  <p className="w-full min-h-[56px] text-[18px] leading-[28px] font-normal text-[#3F3F46] text-center flex items-center justify-center">
                    Вы уверены, что хотите удалить пользователя{" "}
                    <span className="font-semibold text-[#11181C]">{name}</span>
                    ?
                  </p>

                  <p className="w-full h-[28px] text-[18px] leading-[28px] font-normal text-[#3F3F46] text-center flex items-center justify-center">
                    Данное действие отменить невозможно
                  </p>
                </div>
              </ModalBody>

              <ModalFooter className="p-0 w-full">
                <div className="w-full max-w-[445px] h-[48px] flex gap-[40px]">
                  <Button
                    variant="flat"
                    onPress={onClose}
                    className="h-[48px] flex-1 rounded-[12px] bg-[#D4D4D8] text-black px-[24px] text-[16px] leading-[24px] font-normal"
                  >
                    Не удалять
                  </Button>

                  <Button
                    onPress={() => onConfirm(onClose)}
                    isLoading={isSubmitting}
                    isDisabled={!user}
                    className="h-[48px] flex-1 rounded-[12px] bg-[#006FEE] text-white px-[24px] text-[16px] leading-[24px] font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Да, удалить
                  </Button>
                </div>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
