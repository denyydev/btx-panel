import type { AdminFormData, AdminFormErrors } from "./types";

export function validateAdminForm(data: AdminFormData): AdminFormErrors {
  const errors: AdminFormErrors = {};

  if (!data.name.trim()) errors.name = "ФИО обязательно";

  if (!data.email.trim()) {
    errors.email = "Email обязателен";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) errors.email = "Неверный формат email";
  }

  if (!data.birthDate.trim()) errors.birthDate = "Дата рождения обязательна";

  return errors;
}
