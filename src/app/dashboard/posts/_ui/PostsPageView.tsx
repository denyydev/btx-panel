"use client";

import { AppPagination } from "@/shared/ui/AppPagination/AppPagination";
import { AppSearchInput } from "@/shared/ui/AppSearchInput/AppSearchInput";
import { Spinner } from "@heroui/react";
import { PostsDesktopTable } from "./PostsDesktopTable";
import { PostsMobileList } from "./PostsMobileList";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export function PostsPageView(props: any) {
  const {
    error,
    isInitialLoading,
    isRefetching,
    page,
    pages,
    rowsPerPage,
    setPage,
    onPageSizeChange,
    search,
    onSearchChange,
  } = props;

  if (error) {
    return <div className="text-red-600 p-4">Ошибка загрузки постов</div>;
  }

  return (
    <div className="bg-[#E6F1FE] min-h-[calc(100vh-0px)]">
      <div className="mx-auto w-full max-w-[1472px]">
        <div className="px-5 lg:px-0 pt-6 lg:pt-0">
          <div className="flex flex-col items-start gap-3 lg:gap-5">
            <h1 className="text-[20px] leading-7 lg:text-[36px] lg:leading-10 font-semibold text-[#11181C]">
              Публикации
            </h1>
            <p className="text-[14px] leading-5 lg:text-[18px] lg:leading-7 font-normal text-[#3F3F46]">
              Управление публикациями пользователей
            </p>

            <AppSearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Поиск по названию поста"
              className="w-full max-w-[746px]"
            />
          </div>
        </div>

        <div className="mt-5 lg:mt-10">
          {isInitialLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="lg:hidden px-0 relative">
                <PostsMobileList {...props} />
                <div className="px-5 py-4">
                  <AppPagination
                    page={page}
                    totalPages={pages}
                    onChange={setPage}
                    pageSize={rowsPerPage}
                    pageSizeOptions={
                      ROWS_PER_PAGE_OPTIONS as unknown as number[]
                    }
                    onPageSizeChange={onPageSizeChange}
                  />
                </div>
              </div>

              <div className="hidden lg:block">
                <PostsDesktopTable {...props} />
                <div className="mt-6">
                  <AppPagination
                    page={page}
                    totalPages={pages}
                    onChange={setPage}
                    pageSize={rowsPerPage}
                    pageSizeOptions={
                      ROWS_PER_PAGE_OPTIONS as unknown as number[]
                    }
                    onPageSizeChange={onPageSizeChange}
                  />
                </div>
              </div>

              {isRefetching && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                  <Spinner />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
