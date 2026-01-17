"use client";

import { usePostsPage } from "./_model/usePostsPage";
import { PostsPageView } from "./_ui/PostsPageView";

export default function PostsPage() {
  const vm = usePostsPage();
  return <PostsPageView {...vm} />;
}
