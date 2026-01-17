"use client";

import { useAuthMe } from "@/shared/hooks/useAuth";
import { useUpdateProfile } from "@/shared/hooks/useProfile";
import { useAuthStore } from "@/shared/store/auth.store";
import { AppInput } from "@/shared/ui/AppInput/AppInput";
import { Avatar, Button, Chip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

function formatBirth(value?: string) {
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

function roleLabel(role?: string) {
  if (role === "admin") return "Администратор";
  if (role === "moderator") return "Модератор";
  return "Пользователь";
}

export default function UserPage() {
  useAuthMe();
  const me = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    if (!me) return;
    setForm({
      firstName: me.firstName || "",
      lastName: me.lastName || "",
      email: me.email || "",
      image: me.image || "",
    });
  }, [me?.id]);

  const fullName = useMemo(() => {
    const first = (form.firstName || "").trim();
    const last = (form.lastName || "").trim();
    return `${first} ${last}`.trim() || "User";
  }, [form.firstName, form.lastName]);

  const birth = formatBirth((me as any)?.birthDate);

  const onSave = async () => {
    if (!me) return;
    await updateProfile.mutateAsync({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      image: form.image.trim() || undefined,
    });
  };

  if (!me) {
    return (
      <div className="bg-[#E6F1FE] min-h-[100dvh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="-mx-20 -my-20 sm:mx-0 sm:my-0">
      <div className="bg-[#E6F1FE] min-h-[100dvh] sm:min-h-0">
        <div className="block lg:hidden w-full">
          <div className="h-[864px] w-[320px] mx-auto relative overflow-hidden">
            <div className="absolute left-0 top-[88px] w-[320px] flex flex-col items-center gap-3">
              <Avatar
                src={form.image || me.image}
                name={fullName}
                className="w-20 h-20"
              />

              <div className="w-[320px] px-5 flex flex-col items-center gap-2">
                <div className="h-6 rounded-lg bg-[#F5A524] px-2 text-[12px] leading-4 flex items-center text-black">
                  {roleLabel((me as any)?.role)}
                </div>

                <div className="w-[280px] flex flex-col items-center gap-1">
                  <div className="text-[20px] leading-7 font-semibold text-[#11181C] text-center">
                    {fullName}
                  </div>

                  <div className="text-[14px] leading-5 font-normal text-[#006FEE] text-center w-full truncate">
                    {form.email || "-"}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <div className="text-[14px] leading-5 text-[#27272A]">
                      {birth.date}
                    </div>
                    <div className="text-[12px] leading-4 text-[#52525B]">
                      ({birth.age} лет)
                    </div>
                  </div>
                </div>

                <a href="#" className="text-[14px] leading-5 text-[#006FEE]">
                  “First solve the problem. Then, write the code.”
                </a>
              </div>
            </div>

            <div className="absolute left-0 top-[352px] w-[320px] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-[12px] px-5 py-6 flex flex-col gap-5">
              <div className="text-[18px] leading-7 font-semibold text-[#11181C]">
                Личные данные
              </div>

              <div className="flex flex-col gap-4">
                <AppInput
                  label="Имя"
                  value={form.firstName}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, firstName: v }))
                  }
                />
                <AppInput
                  label="Фамилия"
                  value={form.lastName}
                  onValueChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
                />
                <AppInput
                  label="Email"
                  value={form.email}
                  onValueChange={(v) => setForm((p) => ({ ...p, email: v }))}
                />
                <AppInput
                  label="Avatar URL"
                  value={form.image}
                  onValueChange={(v) => setForm((p) => ({ ...p, image: v }))}
                />
              </div>

              <Button
                className="h-10 rounded-[12px] bg-[#D4D4D8] px-4 text-[14px] leading-5 text-[#3F3F46]"
                isLoading={updateProfile.isPending}
                onPress={onSave}
              >
                Сохранить изменения
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="max-w-[1472px] mx-auto flex flex-col gap-10">
            <div className="bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] rounded-[32px] p-10 flex items-start justify-between gap-10">
              <div className="flex items-start gap-10">
                <Avatar
                  src={form.image || me.image}
                  name={fullName}
                  className="w-40 h-40"
                />

                <div className="flex flex-col gap-3">
                  <Chip className="bg-[#F5A524] text-black h-6 px-2 rounded-lg">
                    <span className="text-[12px] leading-4">
                      {roleLabel((me as any)?.role)}
                    </span>
                  </Chip>

                  <div className="text-[36px] leading-10 font-semibold text-[#11181C]">
                    {fullName}
                  </div>

                  <a
                    href="#"
                    className="text-[18px] leading-7 font-normal text-[#006FEE]"
                  >
                    {form.email || "-"}
                  </a>

                  <div className="flex items-baseline gap-1">
                    <div className="text-[18px] leading-7 text-[#27272A]">
                      {birth.date}
                    </div>
                    <div className="text-[14px] leading-5 text-[#52525B]">
                      ({birth.age} лет)
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="text-[18px] leading-7 font-medium text-[#006FEE] self-center"
              >
                “First solve the problem. Then, write the code.”
              </a>
            </div>

            <div className="bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] rounded-[32px] p-10 flex flex-col gap-10">
              <div className="text-[24px] leading-8 font-semibold text-[#11181C]">
                Личные данные
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-7 max-w-[1024px]">
                <AppInput
                  label="Имя"
                  value={form.firstName}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, firstName: v }))
                  }
                />
                <AppInput
                  label="Фамилия"
                  value={form.lastName}
                  onValueChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
                />
                <AppInput
                  label="Email"
                  value={form.email}
                  onValueChange={(v) => setForm((p) => ({ ...p, email: v }))}
                />
                <AppInput
                  label="Avatar URL"
                  value={form.image}
                  onValueChange={(v) => setForm((p) => ({ ...p, image: v }))}
                />
                <AppInput label="Дата рождения" value={birth.date} isReadOnly />
                <AppInput
                  label="Роль"
                  value={roleLabel((me as any)?.role)}
                  isReadOnly
                />
              </div>

              <Button
                className="h-12 w-[222px] rounded-[12px] bg-[#D4D4D8] px-6 text-[16px] leading-6 text-[#3F3F46]"
                isLoading={updateProfile.isPending}
                onPress={onSave}
              >
                Сохранить изменения
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
