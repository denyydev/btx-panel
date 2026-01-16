export type Role = "admin" | "user" | "moderator";

export type SortDescriptor = {
  column: string;
  direction: "asc" | "desc";
};

export type AdminFormData = {
  name: string;
  email: string;
  birthDate: string;
  role: Role;
};

export type AdminFormErrors = {
  name?: string;
  email?: string;
  birthDate?: string;
};

export type ToastMessage = {
  message: string;
  type: "success" | "error";
};

export type AdminEntity = any;
