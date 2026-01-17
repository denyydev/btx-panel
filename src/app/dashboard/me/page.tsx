"use client";

import { useUserPage } from "./_model/useUserPage";
import { UserPageView } from "./_ui/UserPageView";

export default function UserPage() {
  const vm = useUserPage();
  return <UserPageView {...vm} />;
}
