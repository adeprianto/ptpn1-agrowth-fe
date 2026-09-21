"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableState,
} from "@/components/shared/data-table";
import { getJenisDisplay } from "@/features/organisasi/components/unit/jenisUnit";
import type { Pegawai, PegawaiFilterOptions } from "../api/pegawai";

interface PegawaiTableProps {
  rows: Pegawai[];
  /** Total baris dari API (mode server) */
  rowCount: number;
  tableState: DataTableState;
  loading?: boolean;
  options: PegawaiFilterOptions | null;
}

const ENTITY_GROUP_LABEL = {
  HO: "Head Office",
  Regional: "Regional",
  Unit: "Unit",
} as const;

/** Label "Kebun · Teh" untuk satu baris operasional */
export function operasionalLabel(
  jenis: { code: string; name: string } | null,
  komoditas: string | null,
) {
  const jenisLabel = jenis ? getJenisDisplay({ id: 0, ...jenis }).label : null;
  return [jenisLabel, komoditas].filter(Boolean).join(" · ") || "-";
}

const col = createDataTableColumnHelper<Pegawai>();

/**
 * Id kolom sengaja sama dengan nilai `sort` di backend (lihat PegawaiSortKey),
 * jadi `PegawaiList` bisa langsung meneruskannya ke API.
 */
function buildColumns(options: PegawaiFilterOptions | null) {
  const masterOptions = (list: { id: number; name: string }[] | undefined) =>
    list?.map((item) => ({ value: String(item.id), label: item.name })) ?? [];
  const valueOptions = (list: string[] | undefined) =>
    list?.map((v) => ({ value: v, label: v })) ?? [];

  return col.columns([
    col.accessor("nik", {
      header: "NIK (SAP)",
      meta: {
        filter: { type: "text", placeholder: "Cari kode SAP..." },
        cellClassName: "whitespace-nowrap font-mono text-xs text-slate-600",
      },
    }),
    col.accessor("nama", {
      id: "name",
      header: "Nama Pegawai",
      meta: { filter: { type: "text", placeholder: "Cari nama..." } },
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-800">{getValue()}</span>
      ),
    }),
    col.accessor("penempatanNama", {
      id: "entity",
      header: "Entity",
      meta: {
        filter: {
          type: "options",
          options:
            options?.entities.map((e) => ({
              value: e.id,
              label: e.nama,
              group: ENTITY_GROUP_LABEL[e.tipe],
            })) ?? [],
        },
      },
      cell: ({ row }) => (
        <>
          <p className="text-slate-700">{row.original.penempatanNama}</p>
          {row.original.penempatanInduk && (
            <p className="text-xs text-slate-400">{row.original.penempatanInduk}</p>
          )}
        </>
      ),
    }),
    col.accessor(
      (row) => operasionalLabel(row.operasionalJenis, row.operasionalKomoditas),
      {
        id: "operasional",
        header: "Entity Operational",
        meta: {
          filter: {
            type: "options",
            options:
              options?.operasional.map((o) => ({
                value: o.key,
                label: operasionalLabel(o.jenis, o.komoditas),
              })) ?? [],
          },
        },
        cell: ({ row, getValue }) =>
          row.original.operasionalJenis || row.original.operasionalKomoditas ? (
            <span
              className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
                getJenisDisplay(row.original.operasionalJenis ?? undefined).badgeClass
              }`}
            >
              {getValue()}
            </span>
          ) : (
            <span className="text-slate-300">-</span>
          ),
      },
    ),
    col.accessor("jabatan", {
      id: "posisi",
      header: "Posisi",
      meta: {
        filter: { type: "text", placeholder: "Cari nama jabatan..." },
        cellClassName: "text-slate-700",
      },
      cell: ({ getValue }) => getValue() ?? "-",
    }),
    col.accessor("jobGroup", {
      id: "job_group",
      header: "Job Group",
      meta: {
        filter: { type: "options", options: masterOptions(options?.jobGroups) },
        cellClassName: "text-slate-600",
      },
      cell: ({ getValue }) => getValue() ?? "-",
    }),
    col.accessor("jobFunction", {
      id: "job_function",
      header: "Job Function",
      meta: {
        filter: { type: "options", options: masterOptions(options?.jobFunctions) },
        cellClassName: "text-slate-600",
      },
      cell: ({ getValue }) => getValue() ?? "-",
    }),
    col.accessor("levelBod", {
      id: "level",
      header: "Level",
      meta: {
        filter: {
          type: "options",
          options:
            options?.levelBod.map((l) => ({ value: String(l), label: `BOD-${l}` })) ??
            [],
        },
        cellClassName: "whitespace-nowrap font-medium text-slate-700",
      },
      cell: ({ getValue }) => {
        const level = getValue();
        return level ? `BOD-${level}` : "-";
      },
    }),
    col.accessor("golonganPhdp", {
      id: "golongan_phdp",
      header: "Gol. PHDP",
      meta: {
        filter: { type: "options", options: valueOptions(options?.golonganPhdp) },
        cellClassName: "whitespace-nowrap text-slate-600",
      },
      cell: ({ getValue }) => getValue() ?? "-",
    }),
    col.accessor("personGrade", {
      id: "person_grade",
      header: "Person Grade",
      meta: {
        filter: { type: "options", options: valueOptions(options?.personGrade) },
        cellClassName: "whitespace-nowrap text-slate-600",
      },
      cell: ({ getValue }) => getValue() ?? "-",
    }),
    col.display({
      id: "actions",
      header: "Aksi",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <Link
          href={`/pegawai/${row.original.id}`}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200"
        >
          Detail
        </Link>
      ),
    }),
  ]);
}

export function PegawaiTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  options,
}: PegawaiTableProps) {
  // kolom dibuat ulang hanya saat isi checklist filter selesai dimuat
  const columns = useMemo(() => buildColumns(options), [options]);

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      rowCount={rowCount}
      tableState={tableState}
      loading={loading}
      emptyMessage="Tidak ada pegawai yang cocok dengan filter."
      tableClassName="min-w-300"
    />
  );
}
