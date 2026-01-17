export type CommentsPageVM = {
  postId?: number;

  page: number;
  rowsPerPage: number;
  search: string;

  pages: number;

  isLoading: boolean;
  isRefetching: boolean;

  header: string;
  subtitle: string;

  rows: any[];

  setPage: (v: number) => void;
  onSearchChange: (v: string) => void;
  onPageSizeChange: (v: number) => void;

  goBack: () => void;

  error: any;

  pageSizeOptions: readonly number[];
};
