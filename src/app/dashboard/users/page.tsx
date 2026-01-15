'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Chip,
  Pagination,
  Spinner,
} from '@heroui/react';
import { useUsersQuery, useCreateUser, useUpdateUser, useDeleteUser } from '@/shared/hooks/useUsers';
import { useSocket } from '@/shared/hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserRequest, UpdateUserRequest } from '@/shared/api/users.service';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'name',
    direction: 'asc',
  });

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user' });
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const socket = useSocket();
  const queryClient = useQueryClient();

  const skip = (page - 1) * rowsPerPage;
  const sort = sortDescriptor.column ? `${sortDescriptor.column}:${sortDescriptor.direction}` : undefined;

  const { data, isLoading, error } = useUsersQuery({
    limit: rowsPerPage,
    skip,
    search: search || undefined,
    sort,
  });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  useEffect(() => {
    if (!socket) return;

    const handleUserChanged = (data: { type: string; message: string }) => {
      setToastMessage({ message: data.message, type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    socket.on('user:changed', handleUserChanged);

    return () => {
      socket.off('user:changed', handleUserChanged);
    };
  }, [socket, queryClient]);

  const validateForm = (): boolean => {
    const errors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Имя обязательно';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Неверный формат email';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createUser.mutateAsync(formData);
      if (socket) {
        socket.emit('user:changed', { type: 'create', message: `Пользователь ${formData.name} создан` });
      }
      onCreateClose();
      resetForm();
    } catch (err) {
      setToastMessage({ message: 'Не удалось создать пользователя', type: 'error' });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser || !validateForm()) return;

    try {
      await updateUser.mutateAsync({
        id: selectedUser.id,
        data: formData,
      });
      if (socket) {
        socket.emit('user:changed', { type: 'update', message: `Пользователь ${formData.name} обновлен` });
      }
      onEditClose();
      resetForm();
    } catch (err) {
      setToastMessage({ message: 'Не удалось обновить пользователя', type: 'error' });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser.mutateAsync(selectedUser.id);
      if (socket) {
        socket.emit('user:changed', { type: 'delete', message: `Пользователь ${selectedUser.name} удален` });
      }
      onDeleteClose();
      setSelectedUser(null);
    } catch (err) {
      setToastMessage({ message: 'Не удалось удалить пользователя', type: 'error' });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'user' });
    setFormErrors({});
    setSelectedUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    onCreateOpen();
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setFormErrors({});
    onEditOpen();
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };


  const pages = data ? Math.ceil(data.total / rowsPerPage) : 1;

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Ошибка загрузки пользователей
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
            toastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toastMessage.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Пользователи</h2>
        <Button color="primary" onPress={openCreateModal}>
          Создать пользователя
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
          variant="bordered"
        />
        <Select
          selectedKeys={[String(rowsPerPage)]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setRowsPerPage(Number(value));
            setPage(1);
          }}
          className="w-32"
          variant="bordered"
        >
          {ROWS_PER_PAGE_OPTIONS.map((option) => (
            <SelectItem key={String(option)}>
              {option}
            </SelectItem>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table aria-label="Users table">
            <TableHeader>
              <TableColumn
                key="name"
                className="cursor-pointer"
                onClick={() => {
                  setSortDescriptor((prev) => ({
                    column: 'name',
                    direction: prev.column === 'name' && prev.direction === 'asc' ? 'desc' : 'asc',
                  }));
                }}
              >
                Имя {sortDescriptor.column === 'name' && (sortDescriptor.direction === 'asc' ? '↑' : '↓')}
              </TableColumn>
              <TableColumn
                key="email"
                className="cursor-pointer"
                onClick={() => {
                  setSortDescriptor((prev) => ({
                    column: 'email',
                    direction: prev.column === 'email' && prev.direction === 'asc' ? 'desc' : 'asc',
                  }));
                }}
              >
                Email {sortDescriptor.column === 'email' && (sortDescriptor.direction === 'asc' ? '↑' : '↓')}
              </TableColumn>
              <TableColumn key="role">Роль</TableColumn>
              <TableColumn key="actions">Действия</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Пользователи не найдены">
              {(data?.data || []).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      variant="flat"
                      size="sm"
                    >
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => openEditModal(user)}
                      >
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => openDeleteModal(user)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={pages}
                page={page}
                onChange={setPage}
                showControls
              />
            </div>
          )}
        </>
      )}

      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="lg">
        <ModalContent>
          <ModalHeader>Создать пользователя</ModalHeader>
          <ModalBody>
            <Input
              label="Имя"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setFormErrors({ ...formErrors, name: undefined });
              }}
              errorMessage={formErrors.name}
              isInvalid={!!formErrors.name}
              variant="bordered"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setFormErrors({ ...formErrors, email: undefined });
              }}
              errorMessage={formErrors.email}
              isInvalid={!!formErrors.email}
              variant="bordered"
              required
            />
            <Select
              label="Роль"
              selectedKeys={[formData.role]}
              onSelectionChange={(keys) => {
                const role = Array.from(keys)[0] as 'admin' | 'user';
                setFormData({ ...formData, role });
              }}
              variant="bordered"
            >
              <SelectItem key="user">
                Пользователь
              </SelectItem>
              <SelectItem key="admin">
                Администратор
              </SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreateClose}>
              Отмена
            </Button>
            <Button
              color="primary"
              onPress={handleCreate}
              isLoading={createUser.isPending}
            >
              Создать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalContent>
          <ModalHeader>Редактировать пользователя</ModalHeader>
          <ModalBody>
            <Input
              label="Имя"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setFormErrors({ ...formErrors, name: undefined });
              }}
              errorMessage={formErrors.name}
              isInvalid={!!formErrors.name}
              variant="bordered"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setFormErrors({ ...formErrors, email: undefined });
              }}
              errorMessage={formErrors.email}
              isInvalid={!!formErrors.email}
              variant="bordered"
              required
            />
            <Select
              label="Роль"
              selectedKeys={[formData.role]}
              onSelectionChange={(keys) => {
                const role = Array.from(keys)[0] as 'admin' | 'user';
                setFormData({ ...formData, role });
              }}
              variant="bordered"
            >
              <SelectItem key="user">
                Пользователь
              </SelectItem>
              <SelectItem key="admin">
                Администратор
              </SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditClose}>
              Отмена
            </Button>
            <Button
              color="primary"
              onPress={handleEdit}
              isLoading={updateUser.isPending}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Удалить пользователя</ModalHeader>
          <ModalBody>
            <p>
              Вы уверены, что хотите удалить пользователя{' '}
              <strong>{selectedUser?.name}</strong>? Это действие нельзя отменить.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Отмена
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={deleteUser.isPending}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
