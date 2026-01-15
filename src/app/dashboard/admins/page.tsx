'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

export default function AdminsPage() {
    const admins = [
        { id: '1', name: 'Admin One', email: 'admin1@example.com' },
        { id: '2', name: 'Admin Two', email: 'admin2@example.com' },
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Admins</h2>
            <Table aria-label="Admins table">
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                </TableHeader>
                <TableBody>
                    {admins.map((admin) => (
                        <TableRow key={admin.id}>
                            <TableCell>{admin.id}</TableCell>
                            <TableCell>{admin.name}</TableCell>
                            <TableCell>{admin.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

