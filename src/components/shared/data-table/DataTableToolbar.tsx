"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useDataTableContext } from "./DataTableContext";
import type { ColumnFilterValue } from "./dataTableFeatures";

interface ChipProps {
  label: string;
  /** Diisi kalau chip bisa diklik untuk membuka kembali modal filternya */
  onOpen?: () => void;
  onRemove: () => void;
  removeLabel: string;
}

function FilterChip({ label, onOpen, onRemove, removeLabel }: ChipProps) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 py-1 pl-1 pr-1.5 text-xs font-medium text-emerald-700">
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="rounded-full px-2 py-0.5 hover:bg-emerald-100"
        >
          {label}
        </button>
      ) : (
        <span className="px-2 py-0.5">{label}</span>
      )}

      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="rounded-full p-0.5 hover:bg-emerald-100"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

/**
 * Chip untuk tiap filter yang sedang aktif. Pencarian dan daftar centang
 * dapat chip sendiri-sendiri supaya bisa dilepas satu per satu.
 */
export function DataTableActiveFilters() {
  const {
    state,
    columnLabel,
    table,
    filterFields,
    openFilter,
    setColumnSearch,
    setColumnValues,
  } = useDataTableContext();

  if (state.columnFilters.length === 0) {
    return (
      <p className="text-slate-400">
        Ketik di kotak bawah judul kolom untuk mencari, atau klik ikon corong
        untuk memfilter.
      </p>
    );
  }

  const hasChecklist = (columnId: string) =>
    filterFields.some((field) => field.id === columnId);

  return (
    <>
      <span className="text-slate-500">Filter aktif:</span>

      {state.columnFilters.flatMap((filter) => {
        const column = table.getColumn(filter.id);
        const label = column ? columnLabel(column) : filter.id;
        const value = filter.value as ColumnFilterValue;
        const chips: ReactNode[] = [];

        if (value?.search) {
          chips.push(
            <FilterChip
              key={`${filter.id}-search`}
              label={`${label}: "${value.search}"`}
              removeLabel={`Hapus pencarian ${label}`}
              onRemove={() => setColumnSearch(filter.id, "")}
            />,
          );
        }

        if (value?.values?.length) {
          chips.push(
            <FilterChip
              key={`${filter.id}-values`}
              label={`${label}: ${value.values.length} dipilih`}
              removeLabel={`Hapus filter ${label}`}
              onOpen={hasChecklist(filter.id) ? () => openFilter(filter.id) : undefined}
              onRemove={() => setColumnValues(filter.id, undefined)}
            />,
          );
        }

        return chips;
      })}
    </>
  );
}

/** Tautan kecil untuk mengembalikan sort & filter ke nilai awal. */
export function DataTableResetButton() {
  const { state } = useDataTableContext();

  if (!state.isDirty) return null;

  return (
    <button
      type="button"
      onClick={state.reset}
      className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
    >
      Reset filter &amp; urutan
    </button>
  );
}

/**
 * Baris di atas tabel: chip filter yang sedang aktif dan tombol reset.
 *
 * Filter dipasang dari header kolom — kotak cari di bawah judulnya, atau ikon
 * corong untuk daftar centang — jadi baris ini hanya menampilkan hasilnya.
 *
 * @example Tambahkan kontrol sendiri di sisi kiri
 * <DataTableToolbar>
 *   <ButtonLink href="/dashboard/pegawai/create">Tambah</ButtonLink>
 * </DataTableToolbar>
 */
export function DataTableToolbar({ children }: { children?: ReactNode }) {
  const { filterFields, searchFields } = useDataTableContext();

  const hasFilters = filterFields.length > 0 || searchFields.length > 0;
  if (!hasFilters) return children ? <div>{children}</div> : null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {children}
      <DataTableActiveFilters />
      <DataTableResetButton />
    </div>
  );
}
