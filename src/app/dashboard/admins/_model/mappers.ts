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
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const getFullName = (u: any) => {
  const name = u?.name || [u?.firstName, u?.lastName].filter(Boolean).join(" ");
  return String(name || "").trim();
};

export const getRowsFromAdminsResponse = (data: any) => {
  return data?.users || data?.data || [];
};

export const getTotalFromAdminsResponse = (data: any) => {
  return Number(data?.total ?? data?.count ?? 0);
};
