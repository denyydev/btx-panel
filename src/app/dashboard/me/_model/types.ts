export type UserFormState = {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export type BirthInfo = {
  date: string;
  age: string;
};

export type UserPageVM = {
  me: any | null;

  form: UserFormState;
  setForm: React.Dispatch<React.SetStateAction<UserFormState>>;

  fullName: string;
  birth: BirthInfo;
  roleText: string;

  isSaving: boolean;

  onSave: () => Promise<void>;
};
