'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

export default function PostsPage() {
    const posts = [
        { id: '1', title: 'Post 1', author: 'Author 1', status: 'published' },
        { id: '2', title: 'Post 2', author: 'Author 2', status: 'draft' },
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            <Table aria-label="Posts table">
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>TITLE</TableColumn>
                    <TableColumn>AUTHOR</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell>{post.id}</TableCell>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.author}</TableCell>
                            <TableCell>{post.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

