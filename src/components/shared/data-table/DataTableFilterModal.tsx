"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { FilterChecklist } from "../FilterChecklist";
import type { DataTableColumnMeta } from "./dataTableFeatures";

export interface FilterField {
  id: string;
  label: string;
  config: NonNullable<DataTableColumnMeta["filter"]>;
}

interface DataTableFilterModalProps {
  fields: FilterField[];
  /** Filter yang sedang berlaku; jadi nilai awal draft saat modal dibuka */
  value: ColumnFiltersState;
  onApply: (filters: ColumnFiltersState) => void;
  onClose: () => void;
  /** Id kolom yang langsung digulir & disorot saat modal dibuka */
  focusId?: string | null;
}

type Draft = Record<string, string | string[]>;

function toDraft(filters: ColumnFiltersState): Draft {
  return Object.fromEntries(
    filters.map((f) => [f.id, f.value as string | string[]]),
  );
}

function isFilled(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
}

/**
 * Modal berisi semua filter kolom sekaligus. Perubahan ditampung sebagai draft
 * dan baru berlaku saat "Terapkan", jadi API hanya dipanggil sekali.
 * Render modal ini hanya saat dibuka supaya draft selalu mulai dari filter aktif.
 */
export function DataTableFilterModal({
  fields,
  value,
  onApply,
  onClose,
  focusId,
}: DataTableFilterModalProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(value));
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // gulir ke kolom yang ikon filternya diklik
  useEffect(() => {
    if (focusId) {
      sectionRefs.current[focusId]?.scrollIntoView({ block: "center" });
    }
  }, [focusId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    // cegah halaman di belakang ikut tergulir
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function setField(id: string, next: string | string[]) {
    setDraft((prev) => ({ ...prev, [id]: next }));
  }

  function apply() {
    const filters: ColumnFiltersState = fields
      .map((field) => {
        const raw = draft[field.id];
        const value =
          field.config.type === "text" && typeof raw === "string"
            ? raw.trim()
            : raw;
        return { id: field.id, value };
      })
      .filter((f) => isFilled(f.value as string | string[] | undefined));

    onApply(filters);
    onClose();
  }

  const filledCount = fields.filter((f) => isFilled(draft[f.id])).length;
  const textFields = fields.filter((f) => f.config.type === "text");
  const optionFields = fields.filter((f) => f.config.type === "options");

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(e) => {
        // klik di area gelap menutup modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="data-table-filter-title"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2
              id="data-table-filter-title"
              className="text-lg font-bold text-slate-900"
            >
              Filter Data
            </h2>
            <p className="text-sm text-slate-400">
              Atur beberapa filter sekaligus, lalu klik Terapkan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* kolom teks dijajarkan dalam satu baris supaya ringkas */}
          {textFields.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {textFields.map((field) => {
                const current = draft[field.id];

                return (
                  <div
                    key={field.id}
                    ref={(el) => {
                      sectionRefs.current[field.id] = el;
                    }}
                    className={`rounded-xl border p-3 ${
                      focusId === field.id
                        ? "border-emerald-400 ring-2 ring-emerald-500/20"
                        : "border-slate-200"
                    }`}
                  >
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        autoFocus={focusId === field.id}
                        type="text"
                        value={typeof current === "string" ? current : ""}
                        onChange={(e) => setField(field.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") apply();
                        }}
                        placeholder={
                          field.config.type === "text"
                            ? (field.config.placeholder ?? "Cari...")
                            : undefined
                        }
                        className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {optionFields.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {optionFields.map((field) => {
                const current = draft[field.id];
                const selected = Array.isArray(current) ? current : [];

                return (
                  <div
                    key={field.id}
                    ref={(el) => {
                      sectionRefs.current[field.id] = el;
                    }}
                    className={`rounded-xl border p-3 ${
                      focusId === field.id
                        ? "border-emerald-400 ring-2 ring-emerald-500/20"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700">
                        {field.label}
                      </p>
                      {selected.length > 0 && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          {selected.length} dipilih
                        </span>
                      )}
                    </div>
                    {field.config.type === "options" && (
                      <FilterChecklist
                        autoFocus={focusId === field.id}
                        options={field.config.options}
                        selected={selected}
                        onChange={(values) => setField(field.id, values)}
                        listClassName="max-h-44"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={() => setDraft({})}
            disabled={filledCount === 0}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent"
          >
            Hapus semua filter
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-400 px-4 py-2 text-sm font-medium text-white hover:bg-slate-500"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={apply}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Terapkan{filledCount > 0 ? ` (${filledCount} filter)` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
