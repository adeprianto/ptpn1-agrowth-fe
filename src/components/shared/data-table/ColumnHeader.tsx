"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Filter } from "lucide-react";
import { cn } from "@/lib/cn";

export type SortDirection = "asc" | "desc";

export interface SortState<K extends string = string> {
  key: K;
  direction: SortDirection;
}

/** Satu pilihan di daftar centang modal filter. */
export interface FilterOption {
  value: string;
  label: string;
  /** Opsional: judul kelompok, mis. "Head Office" / "Regional" / "Unit" */
  group?: string;
}

interface ColumnHeaderProps<K extends string> {
  label: string;
  /** Diisi kalau kolom ini bisa di-sort */
  sortKey?: K;
  sort?: SortState<K> | null;
  onSortChange?: (sort: SortState<K> | null) => void;
  /** Diisi kalau kolom ini punya daftar centang; memunculkan ikon corong */
  onFilterClick?: () => void;
  /** Warnai ikon corong saat filter kolom ini sedang aktif */
  filterActive?: boolean;
  /** Perataan isi header; samakan dengan perataan selnya */
  align?: "left" | "center" | "right";
  /** Padding sel header — diisi `DataTable` mengikuti kerapatan tabel */
  paddingClass?: string;
  className?: string;
}

const justifyClass = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
} as const;

/**
 * Sel judul kolom: teks judul yang bisa diklik untuk mengurutkan, plus ikon
 * corong yang membuka modal filter kolom itu.
 *
 * Urutan sort berputar: naik → turun → tanpa urutan.
 */
export function ColumnHeader<K extends string>({
  label,
  sortKey,
  sort,
  onSortChange,
  onFilterClick,
  filterActive = false,
  align = "left",
  paddingClass = "px-4 py-3",
  className = "",
}: ColumnHeaderProps<K>) {
  const sortable = sortKey !== undefined && onSortChange !== undefined;
  const activeDirection = sortable && sort?.key === sortKey ? sort.direction : null;

  function cycleSort() {
    if (!sortable) return;

    if (activeDirection === null) {
      onSortChange({ key: sortKey, direction: "asc" });
    } else if (activeDirection === "asc") {
      onSortChange({ key: sortKey, direction: "desc" });
    } else {
      onSortChange(null);
    }
  }

  const SortIcon =
    activeDirection === "asc"
      ? ArrowUp
      : activeDirection === "desc"
        ? ArrowDown
        : ArrowUpDown;

  return (
    <th className={cn(paddingClass, className)}>
      <div className={cn("flex items-center gap-1", justifyClass[align])}>
        {sortable ? (
          <button
            type="button"
            onClick={cycleSort}
            aria-label={`Urutkan berdasarkan ${label}`}
            className={cn(
              "group flex items-center gap-1 whitespace-nowrap uppercase tracking-wide hover:text-slate-600",
              activeDirection && "text-slate-700",
            )}
          >
            {label}
            <SortIcon
              className={cn(
                "h-3 w-3 shrink-0",
                activeDirection
                  ? "text-emerald-600"
                  : "text-slate-300 group-hover:text-slate-400",
              )}
            />
          </button>
        ) : (
          <span className="whitespace-nowrap uppercase tracking-wide">{label}</span>
        )}

        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            aria-label={`Filter ${label}`}
            aria-haspopup="dialog"
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded",
              filterActive
                ? "bg-emerald-100 text-emerald-700"
                : "text-slate-300 hover:bg-slate-100 hover:text-slate-500",
            )}
          >
            <Filter className="h-3 w-3" />
          </button>
        )}
      </div>
    </th>
  );
}
