"use client";

import { useUsersPage } from "./_model/useUsersPage";
import { UsersPageView } from "./_ui/UsersPageView";

export default function UsersPage() {
  const vm = useUsersPage();
  return <UsersPageView {...vm} />;
}
