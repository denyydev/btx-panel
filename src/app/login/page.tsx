"use client";

import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useLogin } from "@/shared/hooks/useAuth";

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
      const message = err instanceof Error ? err.message : "Ошибка входа. Проверьте данные.";
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Вход в панель управления
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="bordered"
            />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="bordered"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={loginMutation.isPending}
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
