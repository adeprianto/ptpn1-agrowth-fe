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
  type DataTableColumnDef,
  type DataTableColumnMeta,
} from "./dataTableFeatures";
import type { FilterOption } from "../ColumnHeader";

/**
 * Kolom siap pakai untuk pola yang berulang di banyak tabel: nomor urut,
 * angka, badge, tautan detail, dan menu aksi.
 *
 * Kolom lain cukup ditulis biasa lewat `createDataTableColumnHelper`.
 */

/** Shorthand meta filter teks: `meta: { filter: textFilter("Cari nama...") }` */
export function textFilter(placeholder?: string): ColumnFilterConfig {
  return { type: "text", placeholder };
}

/** Shorthand meta filter checklist */
export function optionsFilter(options: FilterOption[]): ColumnFilterConfig {
  return { type: "options", options };
}

/** Ubah daftar master (id + name) jadi opsi checklist */
export function toFilterOptions(
  items: { id: number | string; name: string }[] | undefined,
): FilterOption[] {
  return items?.map((item) => ({ value: String(item.id), label: item.name })) ?? [];
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
  filter?: ColumnFilterConfig;
  meta?: DataTableColumnMeta;
}

/** Kolom yang isinya satu badge, mis. status atau jenis unit. */
export function badgeColumn<TRow extends RowData>({
  id,
  header,
  value,
  tone,
  filter,
  meta,
}: BadgeColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.accessor((row) => value(row) ?? "", {
    id,
    header,
    meta: { filter, nowrap: true, ...meta },
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
  filter,
  meta,
}: LinkColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.accessor(value, {
    id,
    header,
    meta: { filter, ...meta },
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
  filter?: ColumnFilterConfig;
  meta?: DataTableColumnMeta;
}

/** Sama seperti `linkColumn`, tapi tanpa tautan. */
export function titleColumn<TRow extends RowData>({
  id,
  header,
  value,
  subtitle,
  filter,
  meta,
}: TitleColumnOptions<TRow>): DataTableColumnDef<TRow> {
  const col = createDataTableColumnHelper<TRow>();

  return col.accessor(value, {
    id,
    header,
    meta: { filter, ...meta },
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
