"use client";

import { Avatar } from "@heroui/react";
import { authorShort } from "../_model/utils";

export function CommentsMobileList(props: any) {
  const { rows } = props;

  return (
    <div className="rounded-t-[16px] overflow-hidden">
      {rows.length ? (
        rows.map((c: any) => {
          const u = c.user;
          const name = authorShort(u);

          return (
            <div
              key={c.id}
              className="box-border flex flex-col items-start p-3 gap-1 bg-white border-b border-[#E4E4E7]"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  src={u?.image}
                  name={name !== "-" ? name : "User"}
                  className="w-5 h-5 shrink-0"
                />
                <span className="text-[14px] leading-5 font-normal text-[#27272A] truncate">
                  {name}
                </span>
              </div>

              <div className="w-full text-[14px] leading-5 font-normal text-[#27272A] whitespace-pre-wrap break-words">
                {c.body || "-"}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-4 bg-white text-[14px] leading-5 font-normal text-[#52525B]">
          Комментарии не найдены
        </div>
      )}
    </div>
  );
}
