"use client";

import { addToast } from "@heroui/react";
import { useEffect } from "react";
import { io } from "socket.io-client";

type EntityChangedPayload = {
  entity: "user" | "admin";
  action: "create" | "update" | "delete";
  id?: number | string;
  meta?: Record<string, unknown>;
  at?: string;
};

export const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  autoConnect: true,
});

export const SocketProvider = () => {
  useEffect(() => {
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
    };
  }, []);

  return null;
};
