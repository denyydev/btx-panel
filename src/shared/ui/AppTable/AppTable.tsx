"use client";

import { Table } from "@heroui/react";
import type { ReactNode } from "react";

type Props = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
};

export function AppTable({ ariaLabel, children, className }: Props) {
  return (
    <Table
      aria-label={ariaLabel}
      removeWrapper
      className={className}
      classNames={{
        base: "w-full max-w-[1472px] rounded-2xl overflow-hidden bg-white",
        table: "w-full",
        thead: "[&>tr]:h-11 [&>tr]:bg-[#FAFAFA]",
        th: "text-sm font-semibold text-[#71717A] px-6 first:pl-6 last:pr-6",
        tr: "h-16 border-b border-[#E4E4E7] data-[hover=true]:bg-[#FAFAFA] odd:bg-white even:bg-white",
        td: "text-base text-[#27272A] px-6 first:pl-6 last:pr-6 align-middle",
      }}
    >
      {children as any}
    </Table>
  );
}
