"use client";

import { AppInput } from "@/shared/ui/AppInput/AppInput";
import { Avatar, Button, Chip } from "@heroui/react";

const mockUser = {
  id: 1,
  firstName: "Emily",
  lastName: "Johnson",
  maidenName: "Smith",
  age: 29,
  gender: "female",
  email: "emily.johnson@x.dummyjson.com",
  phone: "+81 965-431-3024",
  username: "emilys",
  birthDate: "1996-5-30",
  image: "https://dummyjson.com/icon/emilys/128",
  role: "admin",
};

function formatBirth(value: string) {
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

function roleLabel(role: string) {
  if (role === "admin") return "Администратор";
  if (role === "moderator") return "Модератор";
  return "Пользователь";
}

export default function UserPage() {
  const fullName =
    `${mockUser.firstName} ${mockUser.lastName} ${mockUser.maidenName}`.trim();
  const birth = formatBirth(mockUser.birthDate);

  return (
    <div className="-mx-20 -my-20 sm:mx-0 sm:my-0">
      <div className="bg-[#E6F1FE] min-h-[100dvh] sm:min-h-0">
        <div className="block lg:hidden w-full">
          <div className="h-[864px] w-[320px] mx-auto relative overflow-hidden">
            <div className="absolute left-0 top-[88px] w-[320px] flex flex-col items-center gap-3">
              <Avatar
                src={mockUser.image}
                name={fullName}
                className="w-20 h-20"
              />

              <div className="w-[320px] px-5 flex flex-col items-center gap-2">
                <div className="h-6 rounded-lg bg-[#F5A524] px-2 text-[12px] leading-4 flex items-center text-black">
                  {roleLabel(mockUser.role)}
                </div>

                <div className="w-[280px] flex flex-col items-center gap-1">
                  <div className="text-[20px] leading-7 font-semibold text-[#11181C] text-center">
                    {fullName}
                  </div>

                  <div className="text-[14px] leading-5 font-normal text-[#006FEE] text-center w-full truncate">
                    {mockUser.email}
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
                <AppInput label="Имя" value={mockUser.firstName} />
                <AppInput label="Фамилия" value={mockUser.lastName} />
                <AppInput label="Email" value={mockUser.email} />
                <AppInput label="Телефон" value={mockUser.phone} />
              </div>

              <Button className="h-10 rounded-[12px] bg-[#D4D4D8] px-4 text-[14px] leading-5 text-[#3F3F46]">
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
                  src={mockUser.image}
                  name={fullName}
                  className="w-40 h-40"
                />

                <div className="flex flex-col gap-3">
                  <Chip className="bg-[#F5A524] text-black h-6 px-2 rounded-lg">
                    <span className="text-[12px] leading-4">
                      {roleLabel(mockUser.role)}
                    </span>
                  </Chip>

                  <div className="text-[36px] leading-10 font-semibold text-[#11181C]">
                    {fullName}
                  </div>

                  <a
                    href="#"
                    className="text-[18px] leading-7 font-normal text-[#006FEE]"
                  >
                    {mockUser.email}
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
                <AppInput label="Имя" value={mockUser.firstName} />
                <AppInput label="Фамилия" value={mockUser.lastName} />
                <AppInput label="Email" value={mockUser.email} />
                <AppInput label="Телефон" value={mockUser.phone} />
                <AppInput label="Дата рождения" value={birth.date} />
                <AppInput label="Роль" value={roleLabel(mockUser.role)} />
              </div>

              <Button className="h-12 w-[222px] rounded-[12px] bg-[#D4D4D8] px-6 text-[16px] leading-6 text-[#3F3F46]">
                Сохранить изменения
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
