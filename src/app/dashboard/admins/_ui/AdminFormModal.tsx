"use client";

import { cn } from "@/shared/lib/cn";
import { AppInput } from "@/shared/ui/AppInput/AppInput";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
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
      size="full"
      backdrop="opaque"
      isDismissable
      hideCloseButton={false}
      placement="center"
      classNames={{
        base: "bg-transparent shadow-none",
        wrapper: "items-center justify-center",
        backdrop: "bg-black/40",
      }}
    >
      <ModalContent
        className={cn(
          "relative bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
          "flex flex-col items-center isolate",
          "w-[320px] h-[568px] rounded-t-[12px] rounded-b-[0px] px-[20px] py-[32px] gap-[20px]",
          "sm:w-[565px] sm:h-[766px] sm:rounded-[32px] sm:px-[60px] sm:py-[60px] sm:gap-[40px]"
        )}
      >
        {(onClose) => (
          <>
            <ModalHeader
              className={cn(
                "w-full p-0 m-0 flex items-center justify-center text-center",
                "text-[20px] leading-[28px] font-semibold text-[#11181C]",
                "sm:text-[36px] sm:leading-[40px]"
              )}
            >
              {title}
            </ModalHeader>

            <ModalBody className="w-full p-0 m-0">
              <div className="w-full flex flex-col items-center gap-[12px] sm:gap-[40px]">
                <Avatar
                  src={avatarSrc}
                  name={avatarName || "User"}
                  className="w-[60px] h-[60px] bg-[#D4D4D8] sm:w-[120px] sm:h-[120px]"
                  classNames={{
                    icon: "text-[#71717A]",
                    name: "text-[#71717A]",
                  }}
                />

                <div className="w-full flex flex-col gap-[16px] sm:gap-[28px]">
                  <AppInput
                    label="ФИО"
                    value={formData.name}
                    onChange={(e) => onChangeField("name", e.target.value)}
                    error={formErrors.name}
                    classNames={{
                      inputWrapper: "h-[32px] py-[4px] sm:h-[42px] sm:py-[8px]",
                      input:
                        "text-[14px] leading-[20px] sm:text-[16px] sm:leading-[24px]",
                    }}
                  />

                  <AppInput
                    label="Email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => onChangeField("email", e.target.value)}
                    error={formErrors.email}
                    classNames={{
                      inputWrapper: "h-[32px] py-[4px] sm:h-[42px] sm:py-[8px]",
                      input:
                        "text-[14px] leading-[20px] sm:text-[16px] sm:leading-[24px]",
                    }}
                  />

                  <AppInput
                    label="Дата рождения"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => onChangeField("birthDate", e.target.value)}
                    error={formErrors.birthDate}
                    classNames={{
                      inputWrapper: "h-[32px] py-[4px] sm:h-[42px] sm:py-[8px]",
                      input:
                        "text-[14px] leading-[20px] sm:text-[16px] sm:leading-[24px]",
                    }}
                  />
                </div>
              </div>
            </ModalBody>

            <div className="w-full mt-auto">
              <Button
                color="primary"
                onPress={() => onSubmit(onClose)}
                isLoading={isSubmitting}
                isDisabled={!!disabled}
                className={cn(
                  "w-full rounded-[12px] bg-[#006FEE] text-white",
                  "h-[40px] px-[16px] text-[14px] leading-[20px] font-normal",
                  "sm:h-[48px] sm:px-[24px] sm:text-[16px] sm:leading-[24px]"
                )}
              >
                {submitText}
              </Button>

              <Button
                variant="light"
                onPress={onClose}
                className="mt-3 w-full text-[#52525B] sm:hidden"
              >
                Отмена
              </Button>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
