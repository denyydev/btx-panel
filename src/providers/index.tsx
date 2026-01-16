"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { SocketProvider } from "./socket-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-right" />
        <SocketProvider />
        {children}
      </HeroUIProvider>
    </QueryProvider>
  );
}
