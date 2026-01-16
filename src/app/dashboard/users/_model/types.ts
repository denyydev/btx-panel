export type Role = "admin" | "user" | "moderator";

export type SortDescriptor = {
  column: string;
  direction: "asc" | "desc";
};

export type UserFormData = {
  name: string;
  email: string;
  birthDate: string;
  role: Role;
};

export type UserFormErrors = {
  name?: string;
  email?: string;
  birthDate?: string;
};

export type ToastMessage = {
  message: string;
  type: "success" | "error";
};

export type UserEntity = any;
