"use client";

import { AppSearchInput } from "@/shared/ui/AppSearchInput/AppSearchInput";
import { Button } from "@heroui/react";
import { UsersMobileRow } from "./UsersMobileRow";

export function UsersMobileList(props: any) {
  const { rows, search, onSearchChange, actions } = props;

  return (
    <div>
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-[20px] leading-7 font-semibold text-[#11181C]">
          Пользователи
        </h1>
        <p className="mt-1 text-[14px] leading-5 font-normal text-[#3F3F46]">
          Управление пользователями системы
        </p>

        <Button
          color="primary"
          className="mt-3 w-full h-10 rounded-[12px] text-[14px] leading-5 font-normal text-white!"
          onPress={actions.openCreateModal}
        >
          Добавить пользователя
        </Button>

        <div className="mt-5">
          <AppSearchInput
            value={search}
            onChange={onSearchChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="pb-[80px]">
        {rows.length ? (
          rows.map((u: any) => (
            <UsersMobileRow
              key={u.id}
              u={u}
              onEdit={(x) => actions.openEditModal(x)}
              onDelete={(x) => actions.openDeleteModal(x)}
            />
          ))
        ) : (
          <div className="px-5 py-6 text-[14px] text-[#52525B]">
            Пользователи не найдены
          </div>
        )}
      </div>
    </div>
  );
}
