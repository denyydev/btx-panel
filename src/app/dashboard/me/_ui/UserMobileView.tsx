"use client";

import { AppInput } from "@/shared/ui/AppInput/AppInput";
import { Avatar, Button } from "@heroui/react";

export function UserMobileView(props: any) {
  const { me, form, setForm, fullName, birth, roleText, isSaving, onSave } =
    props;

  return (
    <div className="h-[864px] w-[320px] mx-auto relative overflow-hidden">
      <div className="absolute left-0 top-[88px] w-[320px] flex flex-col items-center gap-3">
        <Avatar
          src={form.image || me.image}
          name={fullName}
          className="w-20 h-20"
        />

        <div className="w-[320px] px-5 flex flex-col items-center gap-2">
          <div className="h-6 rounded-lg bg-[#F5A524] px-2 text-[12px] leading-4 flex items-center text-black">
            {roleText}
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
            onValueChange={(v) => setForm((p: any) => ({ ...p, firstName: v }))}
          />
          <AppInput
            label="Фамилия"
            value={form.lastName}
            onValueChange={(v) => setForm((p: any) => ({ ...p, lastName: v }))}
          />
          <AppInput
            label="Email"
            value={form.email}
            onValueChange={(v) => setForm((p: any) => ({ ...p, email: v }))}
          />
          <AppInput
            label="Avatar URL"
            value={form.image}
            onValueChange={(v) => setForm((p: any) => ({ ...p, image: v }))}
          />
        </div>

        <Button
          className="h-10 rounded-[12px] bg-[#D4D4D8] px-4 text-[14px] leading-5 text-[#3F3F46]"
          isLoading={isSaving}
          onPress={onSave}
        >
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
}
