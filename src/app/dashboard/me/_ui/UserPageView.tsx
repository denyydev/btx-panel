"use client";

import { Spinner } from "@heroui/react";
import { UserDesktopView } from "./UserDesktopView";
import { UserMobileView } from "./UserMobileView";

export function UserPageView(props: any) {
  const { me } = props;

  if (!me) {
    return (
      <div className="bg-[#E6F1FE] min-h-[100dvh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="-mx-20 -my-20 sm:mx-0 sm:my-0">
      <div className="bg-[#E6F1FE] min-h-[100dvh] sm:min-h-0">
        <div className="block lg:hidden w-full">
          <UserMobileView {...props} />
        </div>
        <div className="hidden lg:block">
          <UserDesktopView {...props} />
        </div>
      </div>
    </div>
  );
}
