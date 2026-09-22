"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FilterChecklist } from "./FilterChecklist";
import {
  ArrowDown,
  ArrowDownAZ,
  ArrowUp,
  ArrowUpDown,
  ArrowUpZA,
  Filter,
  Search,
} from "lucide-react";

export type SortDirection = "asc" | "desc";

export interface SortState<K extends string = string> {
  key: K;
  direction: SortDirection;
}

export interface FilterOption {
  value: string;
  label: string;
  /** Opsional: judul kelompok, mis. "Head Office" / "Regional" / "Unit" */
  group?: string;
}

interface TextFilter {
  type: "text";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface OptionsFilter {
  type: "options";
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export type ColumnFilter = TextFilter | OptionsFilter;

interface ColumnHeaderProps<K extends string> {
  label: string;
  /** Diisi kalau kolom bisa di-sort */
  sortKey?: K;
  sort?: SortState<K> | null;
  onSortChange?: (sort: SortState<K> | null) => void;
  /** Filter di panel melayang (dibuka lewat ikon corong) */
  filter?: ColumnFilter;
  /**
   * Alternatif `filter`: ikon corong memanggil fungsi ini (mis. membuka modal
   * filter) alih-alih membuka panel melayang. Pakai bersama `filterActive`.
   */
  onFilterClick?: () => void;
  filterActive?: boolean;
  className?: string;
}

const PANEL_WIDTH = 272;

/**
 * Header kolom tabel dengan sorting + filter bergaya Excel.
 * Klik judul untuk sort (naik → turun → tanpa sort); klik ikon corong untuk
 * membuka panel filter, atau memanggil `onFilterClick` kalau diisi. Panel
 * dirender lewat portal karena pembungkus tabel memakai `overflow-x-auto`
 * yang akan memotong panel biasa.
 */
export function ColumnHeader<K extends string>({
  label,
  sortKey,
  sort,
  onSortChange,
  filter,
  onFilterClick,
  filterActive: filterActiveProp,
  className = "",
}: ColumnHeaderProps<K>) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const sortable = sortKey !== undefined && onSortChange !== undefined;
  const activeDirection =
    sortable && sort?.key === sortKey ? sort.direction : null;
  const filterActive =
    filterActiveProp ??
    (filter?.type === "text"
      ? filter.value.trim() !== ""
      : filter?.type === "options"
        ? filter.selected.length > 0
        : false);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    // panel mengikuti posisi tombol; gulir halaman menutup panel,
    // tapi gulir di dalam daftar checklist tidak
    function handleScroll(event: Event) {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleResize() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  function togglePanel() {
    if (onFilterClick) {
      onFilterClick();
      return;
    }

    if (open) {
      setOpen(false);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      // rata kanan ke tombol kalau panel akan keluar layar di kanan
      const left =
        rect.left + PANEL_WIDTH > window.innerWidth - 8
          ? rect.right - PANEL_WIDTH
          : rect.left;
      setPosition({ top: rect.bottom + 6, left: Math.max(8, left) });
    }

    setOpen(true);
  }

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
    <th className={`px-4 py-3 ${className}`}>
      <div className="flex items-center gap-1">
        {sortable ? (
          <button
            type="button"
            onClick={cycleSort}
            className={`group flex items-center gap-1 whitespace-nowrap uppercase tracking-wide hover:text-slate-600 ${
              activeDirection ? "text-slate-700" : ""
            }`}
            aria-label={`Urutkan berdasarkan ${label}`}
          >
            {label}
            <SortIcon
              className={`h-3 w-3 shrink-0 ${
                activeDirection
                  ? "text-emerald-600"
                  : "text-slate-300 group-hover:text-slate-400"
              }`}
            />
          </button>
        ) : (
          <span className="whitespace-nowrap uppercase tracking-wide">
            {label}
          </span>
        )}

        {(filter || onFilterClick) && (
          <button
            ref={buttonRef}
            type="button"
            onClick={togglePanel}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`Filter ${label}`}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
              filterActive
                ? "bg-emerald-100 text-emerald-700"
                : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
            }`}
          >
            <Filter className="h-3 w-3" />
          </button>
        )}
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={`Filter ${label}`}
            style={{ top: position.top, left: position.left, width: PANEL_WIDTH }}
            className="fixed z-50 rounded-xl border border-slate-200 bg-white text-left text-sm font-normal normal-case tracking-normal text-slate-600 shadow-lg"
          >
            {sortable && (
              <div className="border-b border-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({ key: sortKey, direction: "asc" });
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 ${
                    activeDirection === "asc" ? "font-medium text-emerald-700" : ""
                  }`}
                >
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                  Urutkan naik (A → Z)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({ key: sortKey, direction: "desc" });
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 ${
                    activeDirection === "desc" ? "font-medium text-emerald-700" : ""
                  }`}
                >
                  <ArrowUpZA className="h-3.5 w-3.5" />
                  Urutkan turun (Z → A)
                </button>
              </div>
            )}

            {filter?.type === "text" && (
              <TextFilterPanel filter={filter} onDone={() => setOpen(false)} />
            )}
            {filter?.type === "options" && (
              <OptionsFilterPanel filter={filter} onDone={() => setOpen(false)} />
            )}
          </div>,
          document.body,
        )}
    </th>
  );
}

function TextFilterPanel({
  filter,
  onDone,
}: {
  filter: TextFilter;
  onDone: () => void;
}) {
  const [draft, setDraft] = useState(filter.value);

  function apply(value: string) {
    filter.onChange(value.trim());
    onDone();
  }

  return (
    <div className="space-y-2 p-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply(draft);
          }}
          placeholder={filter.placeholder ?? "Cari..."}
          className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
      <PanelFooter
        onReset={() => apply("")}
        onApply={() => apply(draft)}
        resetDisabled={filter.value === "" && draft === ""}
      />
    </div>
  );
}

function OptionsFilterPanel({
  filter,
  onDone,
}: {
  filter: OptionsFilter;
  onDone: () => void;
}) {
  // perubahan centang ditampung dulu, baru dikirim saat "Terapkan"
  // supaya tidak memanggil API di setiap klik
  const [draft, setDraft] = useState<string[]>(filter.selected);

  function apply(values: string[]) {
    filter.onChange(values);
    onDone();
  }

  return (
    <div className="space-y-2 p-3">
      <FilterChecklist
        autoFocus
        options={filter.options}
        selected={draft}
        onChange={setDraft}
      />

      <PanelFooter
        onReset={() => apply([])}
        onApply={() => apply(draft)}
        resetDisabled={filter.selected.length === 0 && draft.length === 0}
        count={draft.length}
      />
    </div>
  );
}

function PanelFooter({
  onReset,
  onApply,
  resetDisabled,
  count,
}: {
  onReset: () => void;
  onApply: () => void;
  resetDisabled: boolean;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        Hapus filter
      </button>
      <button
        type="button"
        onClick={onApply}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
      >
        Terapkan{count ? ` (${count})` : ""}
      </button>
    </div>
  );
}
