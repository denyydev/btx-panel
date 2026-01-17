"use client";

import { AppInput } from "@/shared/ui/AppInput/AppInput";
import { Avatar, Button, Chip } from "@heroui/react";

export function UserDesktopView(props: any) {
  const { me, form, setForm, fullName, birth, roleText, isSaving, onSave } =
    props;

  return (
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
              <span className="text-[12px] leading-4">{roleText}</span>
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
          <AppInput label="Дата рождения" value={birth.date} isReadOnly />
          <AppInput label="Роль" value={roleText} isReadOnly />
        </div>

        <Button
          className="h-12 w-[222px] rounded-[12px] bg-[#D4D4D8] px-6 text-[16px] leading-6 text-[#3F3F46]"
          isLoading={isSaving}
          onPress={onSave}
        >
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
}
