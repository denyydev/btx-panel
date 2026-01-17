"use client";

import { useCommentsPage } from "./_model/useCommentsPage";
import { CommentsPageView } from "./_ui/CommentsPageView";

export default function CommentsPage() {
  const vm = useCommentsPage();
  return <CommentsPageView {...vm} />;
}
