import type { SortDir } from "./types";

export const authorShort = (u?: any) => {
  if (!u) return "-";
  const last = (u.lastName || "").trim();
  const first = (u.firstName || "").trim();
  return `${last} ${first ? first[0] + "." : ""}`.trim();
};

export const nextDir = (dir: SortDir): SortDir =>
  dir === "asc" ? "desc" : "asc";
