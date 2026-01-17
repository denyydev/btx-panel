export function formatBirth(value?: string) {
  if (!value) return { date: "-", age: "-" };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: "-", age: "-" };
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const now = new Date();
  let age = now.getFullYear() - yyyy;
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return { date: `${dd}.${mm}.${yyyy}`, age: `${age}` };
}

export function roleLabel(role?: string) {
  if (role === "admin") return "Администратор";
  if (role === "moderator") return "Модератор";
  return "Пользователь";
}
