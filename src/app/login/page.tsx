"use client";

import { useLogin } from "@/shared/hooks/useAuth";
import { AppInput } from "@/shared/ui/AppInput/AppInput";
import { Button } from "@heroui/react";
import { useState } from "react";

const pickErrorMessage = (err: unknown) => {
  const e: any = err;
  return (
    e?.response?.data?.message ||
    e?.message ||
    "Ошибка входа. Проверьте данные."
  );
};

const Logo = ({ className = "" }: { className?: string }) => (
  <div
    className={[
      "text-[#006FEE] font-semibold tracking-tight select-none",
      className,
    ].join(" ")}
  >
    BTX•
  </div>
);

export default function LoginPage() {
  const loginMutation = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ username, password });
    } catch (err) {
      setError(pickErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#E6F1FE]">
      <div className="mx-auto w-full sm:max-w-[565px] min-h-screen flex flex-col sm:items-center sm:justify-center gap-5">
        <div className="sm:hidden h-[65px] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-b-[20px] flex items-center justify-center px-5">
          <Logo className="text-2xl font-bold" />
        </div>

        <div
          className="
            w-full bg-white
            shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]
            flex flex-col items-center
            gap-5 sm:gap-10
            px-5 py-6 sm:p-[60px]
            sm:rounded-[32px]
            flex-1 sm:flex-none
            rounded-t-[12px] rounded-b-none
          "
        >
          <div className="hidden sm:flex w-full justify-center">
            <Logo className="text-4xl leading-none" />
          </div>

          <div className="w-full max-w-[445px] flex flex-col items-center gap-2 sm:gap-5">
            <div
              className="
  text-[20px] leading-[28px]
  sm:text-[36px] sm:leading-[40px]
  font-semibold text-[#11181C]
  text-center
  sm:whitespace-nowrap
"
            >
              Панель администратора
            </div>
            <div className="text-[14px] leading-[20px] sm:text-[18px] sm:leading-[28px] font-normal text-[#3F3F46] text-center">
              Войдите в систему для продолжения
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[445px] flex flex-col gap-5 sm:gap-7"
          >
            <AppInput
              label="Имя пользователя"
              placeholder="admin@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <AppInput
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="min-h-[20px] text-sm text-red-600 text-center sm:text-left">
              {error || "\u00A0"}
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-12 rounded-[12px] bg-[#006FEE] text-white text-[14px] sm:text-[16px] !text-white"
              isLoading={loginMutation.isPending}
            >
              Войти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
