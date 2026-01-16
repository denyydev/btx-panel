"use client";

import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import {
  formatBirth,
  genderLabel,
  getFullName,
  roleColor,
  roleLabel,
  toNumberOrDash,
} from "../_model/mappers";

export function UsersMobileRow({
  u,
  onEdit,
  onDelete,
}: {
  u: any;
  onEdit: (u: any) => void;
  onDelete: (u: any) => void;
}) {
  const fullName = getFullName(u);

  const birth = formatBirth(u?.birthDate);
  const birthDate = birth.split(" ")[0];
  const birthAge = birth.match(/\((.*?)\)/)?.[0] ?? "";

  const posts = toNumberOrDash(u?.postCount);
  const likes = toNumberOrDash(u?.likeCount);
  const comments = toNumberOrDash(u?.commentCount);

  return (
    <div className="bg-white border-b border-[#E4E4E7] px-5 py-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <Avatar
                src={u?.image}
                name={fullName || "User"}
                className="w-5 h-5 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[16px] leading-6 font-semibold text-[#27272A] truncate">
                  {fullName || "-"}
                </div>

                <div className="mt-2 text-[14px] leading-5 font-normal text-[#338EF7] truncate">
                  {u?.email ? (
                    <a href={`mailto:${u.email}`} className="hover:underline">
                      {u.email}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>

                <div className="mt-2">
                  <Chip
                    color={roleColor(u?.role)}
                    variant="flat"
                    size="sm"
                    classNames={{
                      base: "h-6 min-h-6 px-1 rounded-[8px]",
                      content:
                        "text-[12px] leading-4 font-normal text-black whitespace-nowrap",
                    }}
                  >
                    {roleLabel(u?.role)}
                  </Chip>
                </div>
              </div>
            </div>
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                className="w-6 h-6 p-0 bg-transparent"
              >
                ⋯
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem key="edit" onPress={() => onEdit(u)}>
                Редактировать
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onPress={() => onDelete(u)}
              >
                Удалить
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex items-start gap-2">
          <div className="w-[170px]">
            <div className="text-[12px] leading-4 font-normal text-[#52525B]">
              Дата рождения
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-[14px] leading-5 font-normal text-[#27272A]">
                {birthDate}
              </div>
              <div className="text-[14px] leading-5 font-normal text-[#52525B]">
                {birthAge}
              </div>
            </div>
          </div>

          <div className="w-[64px]">
            <div className="text-[12px] leading-4 font-normal text-[#52525B]">
              Пол
            </div>
            <div className="text-[14px] leading-5 font-normal text-[#27272A]">
              {genderLabel(u?.gender)}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-8 text-[#52525B]">
          <div className="flex items-center gap-1 text-[12px] leading-4 font-normal">
            <span className="text-[16px] leading-4">👁</span>
            <span className="tabular-nums">{posts}</span>
          </div>

          <div className="flex items-center gap-1 text-[12px] leading-4 font-normal">
            <span className="text-[16px] leading-4">♥</span>
            <span className="tabular-nums">{likes}</span>
          </div>

          <div className="flex items-center gap-1 text-[12px] leading-4 font-normal">
            <span className="text-[16px] leading-4">💬</span>
            <span className="tabular-nums">{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
