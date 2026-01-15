"use client";

import { useMemo, useState } from "react";

type AppPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;

  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: readonly number[];

  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getVisiblePages(total: number, current: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set<number>([1, total, current - 1, current, current + 1]);
  const arr = [...set]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out: Array<number | "dots"> = [];
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i];
    const prev = arr[i - 1];
    if (i > 0 && prev && p - prev > 1) out.push("dots");
    out.push(p);
  }
  return out;
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M14 7l-5 5 5 5" stroke="#006FEE" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M10 7l5 5-5 5" stroke="#006FEE" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M8 10l4 4 4-4" stroke="#006FEE" strokeWidth="1.5" />
    </svg>
  );
}

export function AppPagination({
  page,
  totalPages,
  onChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className = "",
}: AppPaginationProps) {
  if (totalPages <= 1) return null;

  const p = clamp(page, 1, totalPages);
  const items = useMemo(() => getVisiblePages(totalPages, p), [totalPages, p]);
  const [open, setOpen] = useState(false);

  const btnBase =
    "h-10 border-2 border-[#006FEE] text-[14px] leading-[20px] font-normal select-none";
  const btnGhost =
    "bg-white text-[#006FEE] hover:bg-[#CCE3FD] active:bg-[#CCE3FD]";
  const btnActive = "bg-[#006FEE] text-white";

  return (
    <div
      className={`w-full flex items-center justify-between px-20 pt-5 pb-10 ${className}`}
    >
      <div className="relative flex items-center gap-[15px]">
        <span className="text-[14px] leading-[20px] font-normal text-[#52525B]">
          Показывать на странице
        </span>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-10 inline-flex items-center gap-2"
        >
          <span className="text-[14px] leading-[20px] font-normal text-[#006FEE]">
            {pageSize}
          </span>
          <ChevronDown />
        </button>

        {open && (
          <div className="absolute left-[171px] top-10 mt-2 w-[120px] rounded-[12px] border border-[#E4E4E7] bg-white shadow-sm overflow-hidden z-50">
            {pageSizeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onPageSizeChange?.(opt);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[14px] leading-[20px] ${
                  opt === pageSize ? "bg-[#E6F1FE]" : "hover:bg-[#FAFAFA]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onChange(clamp(p - 1, 1, totalPages))}
          className={`${btnBase} ${btnGhost} w-[52px] px-4 rounded-l-[14px] flex items-center justify-center`}
          aria-label="Prev"
        >
          <ChevronLeft />
        </button>

        {items.map((it, idx) => {
          if (it === "dots") {
            return (
              <div
                key={`dots-${idx}`}
                className={`${btnBase} ${btnGhost} w-[41px] px-4 -ml-[2px] flex items-center justify-center`}
              >
                …
              </div>
            );
          }

          const isActive = it === p;

          return (
            <button
              key={it}
              type="button"
              onClick={() => onChange(it)}
              className={[
                btnBase,
                isActive ? btnActive : btnGhost,
                "w-[41px] px-4 -ml-[2px] flex items-center justify-center",
              ].join(" ")}
            >
              {it}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onChange(clamp(p + 1, 1, totalPages))}
          className={`${btnBase} ${btnGhost} w-[52px] px-4 -ml-[2px] rounded-r-[14px] flex items-center justify-center`}
          aria-label="Next"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
