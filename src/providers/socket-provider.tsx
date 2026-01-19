"use client";

import { addToast } from "@heroui/react";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { socket } from "@/shared/lib/socket";

type EntityChangedPayload = {
  entity: "user" | "admin";
  action: "create" | "update" | "delete";
  id?: number | string;
  meta?: Record<string, unknown>;
  at?: string;
};

export const SocketProvider = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = socket;

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const onEntityChanged = (payload: EntityChangedPayload) => {
      console.log("👂 entity:changed received", payload);

      const label = payload.entity === "admin" ? "Admin" : "User";

      const actionMap: Record<EntityChangedPayload["action"], string> = {
        create: "created",
        update: "updated",
        delete: "deleted",
      };

      addToast({
        title: `${label} ${actionMap[payload.action]}`,
        description: payload.id != null ? `ID: ${payload.id}` : undefined,
        color: "success",
      });
    };

    socket.on("connect", onConnect);
    socket.on("entity:changed", onEntityChanged);

    return () => {
      socket.off("connect", onConnect);
      socket.off("entity:changed", onEntityChanged);
      socketRef.current = null;
    };
  }, []);

  return null;
};
