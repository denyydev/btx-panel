export type SortKey = "id" | "views" | "likes" | "comments";
export type SortDir = "asc" | "desc";

export type ToastMessage = {
  type: "success" | "error";
  message: string;
} | null;

export type PostsPageVM = {
  page: number;
  rowsPerPage: number;
  search: string;
  sortKey: SortKey;
  sortDir: SortDir;

  pages: number;
  isInitialLoading: boolean;
  isRefetching: boolean;

  rows: any[];
  commentsMap: Record<string, number | undefined>;

  setPage: (v: number) => void;
  onPageSizeChange: (v: number) => void;
  onSearchChange: (v: string) => void;
  onSort: (k: SortKey) => void;
  sortIcon: (k: SortKey) => string;

  goToComments: (postId: number) => void;

  error: any;
};
