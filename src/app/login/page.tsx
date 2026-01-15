'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@heroui/react';
import { useAuthStore } from '@/shared/store/auth.store';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError('Ошибка входа. Проверьте данные.');
            console.error('Login error:', err);
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
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    {error && (
                        <div className="text-sm text-red-600">{error}</div>
                    )}

                    <Button
                        type="submit"
                        color="primary"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Войти
                    </Button>
                </form>
            </div>
        </div>
    );
}

