"use client";

import { Input } from "@heroui/react";

type AppSearchInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        stroke="#A1A1AA"
        strokeWidth="1.5"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="#A1A1AA"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppSearchInput({
  value,
  onChange,
  placeholder = "Поиск по имени или email...",
  className = "",
}: AppSearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant="bordered"
      startContent={<SearchIcon />}
      className={className}
      classNames={{
        base: "w-full",
        inputWrapper:
          "h-10 min-h-10 bg-white border-2 border-[#E4E4E7] rounded-[12px] px-3 py-2 shadow-none",
        input:
          "text-[16px] leading-6 font-normal text-[#11181C] placeholder:text-[#71717A]",
      }}
    />
  );
}
