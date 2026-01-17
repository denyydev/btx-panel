"use client";

import { Avatar, Button, Spinner } from "@heroui/react";
import { authorShort } from "../_model/utils";

export function PostsMobileList(props: any) {
  const { rows, commentsMap, isRefetching, goToComments } = props;

  return (
    <div className="relative">
      <div className="rounded-t-[16px] overflow-hidden relative">
        {rows.length ? (
          rows.map((p: any) => {
            const u = p.user;
            const name = authorShort(u);
            const author = name !== "-" ? name : `User ${p.userId}`;
            const commentsCount = commentsMap[String(p.id)];

            return (
              <div
                key={p.id}
                className="box-border w-full bg-white border-b border-[#E4E4E7] px-5 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] leading-4 font-normal text-[#52525B]">
                    {p.id}
                  </span>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="min-w-0 w-6 h-6 text-[#71717A]"
                    onPress={() => goToComments(p.id)}
                  >
                    →
                  </Button>
                </div>

                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={u?.image}
                      name={author}
                      className="w-5 h-5 shrink-0"
                    />
                    <span className="text-[14px] leading-5 font-normal text-[#27272A] truncate">
                      {author}
                    </span>
                  </div>

                  <div className="text-[14px] leading-5 font-semibold text-[#27272A]">
                    {p.title || p.name || "-"}
                  </div>

                  <div className="flex items-center gap-4 text-[12px] leading-4 font-normal text-[#52525B]">
                    <span>👁 {p.views ?? "-"}</span>
                    <span>❤ {p.reactions?.likes ?? "-"}</span>
                    <span>💬 {commentsCount ?? "-"}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-4 text-[14px] leading-5 font-normal text-[#52525B]">
            Посты не найдены
          </div>
        )}

        {isRefetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
