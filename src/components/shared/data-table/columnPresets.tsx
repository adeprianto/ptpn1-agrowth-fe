"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { RowData } from "@tanstack/react-table";
import { Badge, type BadgeTone } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { RowActionMenu, type RowAction } from "../RowActionMenu";
import {
  createDataTableColumnHelper,
  type ColumnFilterConfig,
  type ColumnSearchConfig,
  type DataTableColumnDef,
  type DataTableColumnMeta,
} from "./dataTableFeatures";
import type { FilterOption } from "./ColumnHeader";

/**
 * Kolom siap pakai untuk pola yang berulang di banyak tabel: nomor urut,
 * angka, badge, tautan detail, dan menu aksi.
 *
 * Kolom lain cukup ditulis biasa lewat `createDataTableColumnHelper`.
 */

/** Ubah daftar master domain (id + nama) jadi opsi checklist */
export function toFilterOptions(
  items: { id: number | string; nama: string }[] | undefined,
): FilterOption[] {
  return items?.map((item) => ({ value: String(item.id), label: item.nama })) ?? [];
}

/** Ubah daftar nilai teks jadi opsi checklist */
export function toValueOptions(values: string[] | undefined): FilterOption[] {
  return values?.map((value) => ({ value, label: value })) ?? [];
}

/**
 * Kolom nomor urut. Tidak bisa di-sort karena isinya posisi baris, bukan data.
 *
 * @param startIndex Nomor baris pertama di halaman ini — dari `meta.from` API,
 *                   atau `pageIndex * pageSize + 1` untuk mode client.
 */
export function rowNumberColumn<TRow extends RowData>(
  startIndex = 1,
  header = "No",
): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.display({
    id: "__rowNumber",
    header,
    enableSorting: false,
    meta: { width: "w-16", nowrap: true, cellClassName: "text-slate-500" },
    cell: ({ row }) => startIndex + row.index,
  });
}

interface SelectColumnOptions<TRow> {
  /** Apakah baris ini sedang dicentang */
  isSelected: (row: TRow) => boolean;
  /** Dipanggil saat centang satu baris diubah */
  onToggle: (row: TRow, checked: boolean) => void;
  /** Centang di judul kolom menyala kalau semua baris di halaman ini terpilih */
  allSelected: boolean;
  /** Dipanggil saat centang di judul kolom diubah: pilih/lepas semua baris di halaman ini */
  onToggleAll: (checked: boolean) => void;
  /** Dibacakan pembaca layar, mis. `(row) => "Pilih " + row.nama` */
  ariaLabel?: (row: TRow) => string;
  disabled?: boolean;
}

const checkboxClass = "h-4 w-4 cursor-pointer rounded accent-emerald-600 disabled:cursor-not-allowed";

/**
 * Kolom checkbox di ujung kiri tabel untuk memilih baris (check/uncheck).
 *
 * Kolom ini tidak menyimpan pilihan sendiri — daftar yang terpilih dipegang
 * komponen pemakainya, jadi pilihan tetap utuh saat pindah halaman tabel.
 *
 * @example
 * selectColumn<Pegawai>({
 *   isSelected: (row) => terpilih.has(row.id),
 *   onToggle: (row, checked) => ubahPilihan(row, checked),
 *   allSelected: rows.every((row) => terpilih.has(row.id)),
 *   onToggleAll: (checked) => ubahPilihanHalamanIni(checked),
 * })
 */
export function selectColumn<TRow extends RowData>({
  isSelected,
  onToggle,
  allSelected,
  onToggleAll,
  ariaLabel,
  disabled = false,
}: SelectColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.display({
    id: "__select",
    header: "Pilih",
    enableSorting: false,
    meta: {
      width: "w-12",
      headerContent: (
        <input
          type="checkbox"
          aria-label="Pilih semua baris di halaman ini"
          className={checkboxClass}
          checked={allSelected}
          disabled={disabled}
          onChange={(event) => onToggleAll(event.target.checked)}
        />
      ),
    },
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label={ariaLabel?.(row.original) ?? "Pilih baris"}
        className={checkboxClass}
        checked={isSelected(row.original)}
        disabled={disabled}
        onChange={(event) => onToggle(row.original, event.target.checked)}
      />
    ),
  });
}

interface ActionsColumnOptions<TRow> {
  /** Aksi per baris; kembalikan array kosong untuk menyembunyikan menu */
  actions: (row: TRow) => RowAction[];
  /** Dibacakan pembaca layar, mis. `(row) => "Aksi untuk " + row.nama` */
  ariaLabel?: (row: TRow) => string;
  header?: string;
}

/**
 * Kolom menu aksi (titik tiga) di ujung kanan tabel.
 *
 * @example
 * actionsColumn<Unit>({
 *   ariaLabel: (unit) => `Aksi untuk ${unit.nama}`,
 *   actions: (unit) => [
 *     { label: "Lihat Detail", icon: Eye, href: `/organisasi/unit/${unit.id}` },
 *     { label: "Hapus", icon: Trash2, variant: "danger", onClick: () => onDelete(unit) },
 *   ],
 * })
 */
export function actionsColumn<TRow extends RowData>({
  actions,
  ariaLabel,
  header = "Aksi",
}: ActionsColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.display({
    id: "__actions",
    header,
    enableSorting: false,
    meta: { align: "right", nowrap: true },
    cell: ({ row }) => {
      const items = actions(row.original);
      if (items.length === 0) return null;

      return (
        <div className="flex justify-end">
          <RowActionMenu actions={items} label={ariaLabel?.(row.original)} />
        </div>
      );
    },
  });
}

interface NumberColumnOptions<TRow> {
  id: string;
  header: string;
  value: (row: TRow) => number | null | undefined;
  /** Teks di belakang angka, mis. "Unit" atau "Karyawan" */
  suffix?: string;
  meta?: DataTableColumnMeta;
}

/** Kolom angka yang sudah diformat locale id-ID dan rata kanan. */
export function numberColumn<TRow extends RowData>({
  id,
  header,
  value,
  suffix,
  meta,
}: NumberColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.accessor((row) => value(row) ?? 0, {
    id,
    header,
    sortFn: "basic",
    meta: { align: "right", nowrap: true, ...meta },
    cell: ({ getValue }) => {
      const text = formatNumber(getValue() as number);
      return suffix ? `${text} ${suffix}` : text;
    },
  });
}

interface BadgeColumnOptions<TRow> {
  id: string;
  header: string;
  value: (row: TRow) => string | null | undefined;
  /** Warna badge per baris; default emerald */
  tone?: (row: TRow) => BadgeTone;
  /** Kotak cari di bawah judul kolom */
  search?: ColumnSearchConfig;
  /** Daftar centang di modal filter */
  filter?: ColumnFilterConfig;
  meta?: DataTableColumnMeta;
}

/** Kolom yang isinya satu badge, mis. status atau jenis unit. */
export function badgeColumn<TRow extends RowData>({
  id,
  header,
  value,
  tone,
  search,
  filter,
  meta,
}: BadgeColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.accessor((row) => value(row) ?? "", {
    id,
    header,
    meta: { search, filter, nowrap: true, ...meta },
    cell: ({ row, getValue }) => {
      const text = getValue() as string;
      if (!text) return <span className="text-slate-300">-</span>;

      return <Badge tone={tone?.(row.original) ?? "emerald"}>{text}</Badge>;
    },
  });
}

interface LinkColumnOptions<TRow> {
  id: string;
  header: string;
  value: (row: TRow) => string;
  href: (row: TRow) => string;
  /** Baris kedua yang lebih redup, mis. kode entity di bawah namanya */
  subtitle?: (row: TRow) => string | null | undefined;
  /** Kotak cari di bawah judul kolom */
  search?: ColumnSearchConfig;
  /** Daftar centang di modal filter */
  filter?: ColumnFilterConfig;
  meta?: DataTableColumnMeta;
}

/** Kolom judul yang menautkan ke halaman detail, dengan subjudul opsional. */
export function linkColumn<TRow extends RowData>({
  id,
  header,
  value,
  href,
  subtitle,
  search,
  filter,
  meta,
}: LinkColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.accessor(value, {
    id,
    header,
    meta: { search, filter, ...meta },
    cell: ({ row, getValue }) => (
      <>
        <Link
          href={href(row.original)}
          className="font-medium text-slate-800 hover:text-emerald-700 hover:underline"
        >
          {getValue() as ReactNode}
        </Link>
        {subtitle?.(row.original) && (
          <p className="text-xs text-slate-400">{subtitle(row.original)}</p>
        )}
      </>
    ),
  });
}

interface TitleColumnOptions<TRow> {
  id: string;
  header: string;
  value: (row: TRow) => string;
  subtitle?: (row: TRow) => string | null | undefined;
  /** Kotak cari di bawah judul kolom */
  search?: ColumnSearchConfig;
  /** Daftar centang di modal filter */
  filter?: ColumnFilterConfig;
  meta?: DataTableColumnMeta;
}

/** Sama seperti `linkColumn`, tapi tanpa tautan. */
export function titleColumn<TRow extends RowData>({
  id,
  header,
  value,
  subtitle,
  search,
  filter,
  meta,
}: TitleColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.accessor(value, {
    id,
    header,
    meta: { search, filter, ...meta },
    cell: ({ row, getValue }) => (
      <>
        <p className="font-medium text-slate-800">{getValue() as ReactNode}</p>
        {subtitle?.(row.original) && (
          <p className="text-xs text-slate-400">{subtitle(row.original)}</p>
        )}
      </>
    ),
  });
}
