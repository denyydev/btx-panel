"use client";

import { useLogin } from "@/shared/hooks/useAuth";
import { AppInput } from "@/shared/ui/AppInput/AppInput";
import { Button } from "@heroui/react";
import { useState } from "react";

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
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ошибка входа. Проверьте данные.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#E6F1FE] flex items-center justify-center">
      <div className="w-full max-w-[565px] rounded-[32px] bg-white p-[60px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex flex-col items-center gap-10">
        <div className="text-[#006FEE] font-semibold tracking-tight text-2xl leading-none select-none">
          BTX•
        </div>

        <div className="w-full max-w-[445px] flex flex-col items-center gap-5">
          <div className="w-full text-[36px] leading-[40px] font-semibold text-[#11181C] text-center">
            Панель администратора
          </div>
          <div className="w-full text-[18px] leading-[28px] font-normal text-[#3F3F46] text-center">
            Войдите в систему для продолжения
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[445px] flex flex-col items-stretch gap-7"
        >
          <AppInput
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
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

          <div className="min-h-[20px] text-sm text-red-600">
            {error ? error : "\u00A0"}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-[12px] bg-[#006FEE] text-white text-[16px] leading-[24px] font-normal"
            isLoading={loginMutation.isPending}
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
