"use client";

import { AppPagination } from "@/shared/ui/AppPagination/AppPagination";
import { AppSearchInput } from "@/shared/ui/AppSearchInput/AppSearchInput";
import { Button, Spinner } from "@heroui/react";
import { CommentsDesktopTable } from "./CommentsDesktopTable";
import { CommentsMobileList } from "./CommentsMobileList";

export function CommentsPageView(props: any) {
  const {
    error,
    isLoading,
    isRefetching,
    header,
    subtitle,
    search,
    onSearchChange,
    goBack,
    page,
    pages,
    rowsPerPage,
    onPageSizeChange,
    setPage,
    pageSizeOptions,
  } = props;

  if (error) {
    return <div className="text-red-600 p-4">Ошибка загрузки комментариев</div>;
  }

  return (
    <div className="bg-[#E6F1FE] min-h-[calc(100vh-0px)]">
      <div className="mx-auto w-full max-w-[1472px] px-0 lg:px-20 py-0">
        <div className="px-5 lg:px-0 pt-6 lg:pt-0">
          <Button
            variant="light"
            className="px-0 h-5 min-w-0 text-[12px] leading-4 font-normal text-[#52525B]"
            onPress={goBack}
          >
            ← Назад к постам
          </Button>
        </div>

        <div className="px-5 lg:px-0 mt-3 lg:mt-10 flex flex-col items-start gap-3 lg:gap-5">
          <h1 className="text-[20px] leading-7 lg:text-[36px] lg:leading-10 font-semibold text-[#11181C]">
            {header}
          </h1>
          <p className="text-[14px] leading-5 lg:text-[18px] lg:leading-7 font-normal text-[#3F3F46]">
            {subtitle}
          </p>

          <AppSearchInput
            placeholder="Поиск по комментариям"
            value={search}
            onChange={onSearchChange}
            className="w-full max-w-[746px] lg:max-w-[746px]"
          />
        </div>

        <div className="mt-5 lg:mt-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="lg:hidden px-[2px] relative">
                <CommentsMobileList {...props} />
                {isRefetching && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <Spinner />
                  </div>
                )}
              </div>

              <div className="hidden lg:block bg-white rounded-[16px] p-3 relative">
                <CommentsDesktopTable {...props} />

                <AppPagination
                  page={page}
                  totalPages={pages}
                  onChange={setPage}
                  pageSize={rowsPerPage}
                  pageSizeOptions={pageSizeOptions}
                  onPageSizeChange={onPageSizeChange}
                />

                {isRefetching && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[16px]">
                    <Spinner />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
