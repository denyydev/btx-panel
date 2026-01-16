"use client";

import { cn } from "@/shared/lib/cn";
import { Input, type InputProps } from "@heroui/react";

type AppInputProps = Omit<InputProps, "variant" | "labelPlacement"> & {
  error?: string;
};

export function AppInput({
  classNames,
  error,
  isInvalid,
  placeholder,
  ...props
}: AppInputProps) {
  const invalid = Boolean(error) || Boolean(isInvalid);

  return (
    <Input
      {...props}
      labelPlacement="outside"
      variant="bordered"
      placeholder={placeholder ?? ""}
      isInvalid={invalid}
      errorMessage={error ?? props.errorMessage}
      classNames={{
        base: cn("w-full min-w-[116px]", typeof classNames?.base === "string" ? classNames.base : ""),
        label: cn(
          "text-[12px] leading-[16px] font-normal text-[#52525B] mb-3 pr-2",
          typeof classNames?.label === "string" ? classNames.label : ""
        ),
        inputWrapper: cn(
          "h-[42px] min-h-[32px] px-[6px] py-[8px]",
          "border-2 rounded-[12px] transition-colors",
          invalid
            ? "border-red-500 focus-within:ring-4 focus-within:ring-red-500/15"
            : "border-[#E4E4E7] hover:border-[#D4D4D8] focus-within:border-[#6366F1] focus-within:ring-4 focus-within:ring-[#6366F1]/15",
          "shadow-[0px_1px_2px_rgba(0,0,0,0.05)]",
          typeof classNames?.inputWrapper === "string" ? classNames.inputWrapper : ""
        ),
        input: cn(
          "text-[16px] leading-[24px] font-normal px-[6px] pb-[2px]",
          "placeholder:opacity-100 placeholder:text-[#71717A]",
          "[&::placeholder]:!opacity-100",
          typeof classNames?.input === "string" ? classNames.input : ""
        ),
        errorMessage: cn("text-xs mt-1", typeof classNames?.errorMessage === "string" ? classNames.errorMessage : ""),
        description: cn("text-xs mt-1", typeof classNames?.description === "string" ? classNames.description : ""),
        ...classNames,
      }}
    />
  );
}
