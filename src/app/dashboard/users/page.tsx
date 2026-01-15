'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@heroui/react';
import { useUsers } from '@/shared/hooks/useUsers';

export default function UsersPage() {
    const { data: users, isLoading, error } = useUsers();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600">
                Ошибка загрузки пользователей
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <Table aria-label="Users table">
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No users found">
                    {(users || []).map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

