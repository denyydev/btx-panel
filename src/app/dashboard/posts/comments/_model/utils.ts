export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export const authorShort = (u?: any) => {
  if (!u) return "-";
  const full = (u.fullName || "").trim();
  if (full) {
    const parts = full.split(/\s+/).filter(Boolean);
    const last = parts[0] || "";
    const first = parts[1] || "";
    return `${last} ${first ? first[0] + "." : ""}`.trim();
  }
  const username = (u.username || "").trim();
  return username || "-";
};
