export const formatBirth = (value: unknown) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const now = new Date();
  let age = now.getFullYear() - yyyy;
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return `${dd}.${mm}.${yyyy} (${age}лет)`;
};

export const genderLabel = (v: unknown) => {
  if (!v) return "-";
  const s = String(v).toLowerCase();
  if (["m", "male", "man", "м", "муж", "мужской"].includes(s)) return "Мужской";
  if (["f", "female", "woman", "ж", "жен", "женский"].includes(s))
    return "Женский";
  return String(v);
};

export const toIsoDateInput = (value: unknown) => {
  if (!value) return "";
  const s = String(value);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const toNumberOrDash = (v: unknown) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)))
    return Number(v);
  return "-";
};

export const getFullName = (u: any) => {
  const name = u?.name || [u?.firstName, u?.lastName].filter(Boolean).join(" ");
  return String(name || "").trim();
};

export const roleLabel = (role: unknown) => {
  const r = String(role || "user");
  if (r === "admin") return "Администратор";
  if (r === "moderator") return "Модератор";
  return "Пользователь";
};

export const roleColor = (role: unknown) => {
  const r = String(role || "user");
  if (r === "admin") return "primary" as const;
  if (r === "moderator") return "secondary" as const;
  return "default" as const;
};

export const getRowsFromUsersResponse = (data: any) => {
  return data?.users || data?.data || [];
};

export const getTotalFromUsersResponse = (data: any) => {
  return Number(data?.total ?? data?.count ?? 0);
};
