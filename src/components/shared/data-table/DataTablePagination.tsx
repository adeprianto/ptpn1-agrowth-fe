"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "./useDataTableState";

/**
 * Nomor halaman yang ditampilkan, dengan "…" untuk bagian yang dilompati.
 * Contoh untuk 20 halaman di halaman 9: 1 … 8 9 10 … 20
 */
export function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page++) pages.push(page);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);

  return pages;
}

interface DataTablePaginationProps {
  /** 0-indexed, sama dengan `PaginationState.pageIndex` TanStack */
  pageIndex: number;
  pageSize: number;
  /** Total baris setelah filter (dari `meta.total` API untuk mode server) */
  totalRows: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Navigasi halaman + pilihan jumlah baris per halaman.
 * Dipakai otomatis oleh `DataTable`, tapi bisa juga dipakai terpisah.
 */
export function DataTablePagination({
  pageIndex,
  pageSize,
  totalRows,
  onPageIndexChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className = "",
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(pageIndex + 1, totalPages);
  const from = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalRows);

  // pastikan ukuran yang sedang dipakai selalu ada di pilihan
  const sizes = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  return (
    <div
      className={cn(
        // ponsel — ditumpuk
        "flex flex-col items-center justify-between gap-3",
        // sm ke atas — berjajar
        "sm:flex-row",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
        <label className="flex items-center gap-2">
          Tampilkan
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          per halaman
        </label>
        <span className="text-slate-400">
          {totalRows === 0
            ? "Tidak ada data"
            : `Menampilkan ${from.toLocaleString("id-ID")}–${to.toLocaleString(
                "id-ID",
              )} dari ${totalRows.toLocaleString("id-ID")} data`}
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageIndexChange(currentPage - 2)}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPageNumbers(currentPage, totalPages).map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-slate-300"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageIndexChange(page - 1)}
                aria-current={page === currentPage ? "page" : undefined}
                className={cn(
                  // tata letak
                  "flex h-9 min-w-9 items-center justify-center",
                  // tampilan
                  "rounded-lg border border-slate-300 px-2",
                  // teks
                  "text-sm font-medium",
                  // gerak
                  "transition-colors",
                  // keadaan
                  page === currentPage
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:bg-slate-100",
                )}
              >
                {page.toLocaleString("id-ID")}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageIndexChange(currentPage)}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
