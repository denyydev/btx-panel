"use client";

import { useAdminsPage } from "./_model/useAdminsPage";
import { AdminsPageView } from "./_ui/AdminsPageView";

export default function AdminsPage() {
  const vm = useAdminsPage();
  return <AdminsPageView {...vm} />;
}
