"use client";

import { useMemo } from "react";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  optionsFilter,
  textFilter,
  toFilterOptions,
  toValueOptions,
  type DataTableState,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge, ButtonLink } from "@/components/ui";
import { getJenisDisplay } from "@/features/organisasi/components/unit/jenisUnit";
import { ENTITY_TIPE_LABEL } from "@/features/organisasi/model/entity";
import { orDash } from "@/lib/format";
import {
  levelBodLabel,
  operasionalLabel,
  type Pegawai,
  type PegawaiFilterOptions,
} from "../model/pegawai";

const col = createDataTableColumnHelper<Pegawai>();

/** Label "Kebun · Teh" untuk satu baris operasional pegawai. */
export function pegawaiOperasionalLabel(pegawai: Pegawai) {
  const jenis = pegawai.operasionalJenis
    ? getJenisDisplay(pegawai.operasionalJenis)
    : null;

  return operasionalLabel(jenis, pegawai.operasionalKomoditas);
}

/**
 * Konfigurasi tabel pegawai.
 *
 * Id kolom sengaja sama dengan nilai `sort`/filter di backend (lihat
 * `EmployeeSortKey`), jadi `PegawaiList` bisa langsung meneruskannya ke API.
 */
export function createPegawaiTableConfig(
  options: PegawaiFilterOptions | null,
): TableConfig<Pegawai> {
  return defineTableConfig<Pegawai>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-300",
    density: "compact",
    defaultSorting: [{ id: "name", desc: false }],
    emptyMessage: "Tidak ada pegawai yang cocok dengan filter.",
    columns: col.columns([
      col.accessor("nik", {
        header: "NIK (SAP)",
        meta: {
          filter: textFilter("Cari kode SAP..."),
          nowrap: true,
          cellClassName: "font-mono text-xs text-slate-600",
        },
      }),
      col.accessor("nama", {
        id: "name",
        header: "Nama Pegawai",
        meta: { filter: textFilter("Cari nama...") },
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-800">{getValue()}</span>
        ),
      }),
      col.accessor("penempatanNama", {
        id: "entity",
        header: "Entity",
        meta: {
          filter: optionsFilter(
            options?.entities.map((entity) => ({
              value: entity.id,
              label: entity.nama,
              group: ENTITY_TIPE_LABEL[entity.tipe],
            })) ?? [],
          ),
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
      col.accessor(pegawaiOperasionalLabel, {
        id: "operasional",
        header: "Entity Operational",
        meta: {
          filter: optionsFilter(
            options?.operasional.map((row) => ({
              value: row.key,
              label: operasionalLabel(
                row.jenis ? getJenisDisplay(row.jenis) : null,
                row.komoditas,
              ),
            })) ?? [],
          ),
        },
        cell: ({ row, getValue }) =>
          row.original.operasionalJenis || row.original.operasionalKomoditas ? (
            <Badge tone={getJenisDisplay(row.original.operasionalJenis).tone}>
              {getValue() as string}
            </Badge>
          ) : (
            <span className="text-slate-300">-</span>
          ),
      }),
      col.accessor("jabatan", {
        id: "posisi",
        header: "Posisi",
        meta: {
          filter: textFilter("Cari nama jabatan..."),
          cellClassName: "text-slate-700",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("jobGroup", {
        id: "job_group",
        header: "Job Group",
        meta: {
          filter: optionsFilter(toFilterOptions(options?.jobGroups)),
          cellClassName: "text-slate-600",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("jobFunction", {
        id: "job_function",
        header: "Job Function",
        meta: {
          filter: optionsFilter(toFilterOptions(options?.jobFunctions)),
          cellClassName: "text-slate-600",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("levelBod", {
        id: "level",
        header: "Level",
        meta: {
          filter: optionsFilter(
            options?.levelBod.map((level) => ({
              value: String(level),
              label: levelBodLabel(level),
            })) ?? [],
          ),
          nowrap: true,
          cellClassName: "font-medium text-slate-700",
        },
        cell: ({ getValue }) => levelBodLabel(getValue()),
      }),
      col.accessor("golonganPhdp", {
        id: "golongan_phdp",
        header: "Gol. PHDP",
        meta: {
          filter: optionsFilter(toValueOptions(options?.golonganPhdp)),
          nowrap: true,
          cellClassName: "text-slate-600",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("personGrade", {
        id: "person_grade",
        header: "Person Grade",
        meta: {
          filter: optionsFilter(toValueOptions(options?.personGrade)),
          nowrap: true,
          cellClassName: "text-slate-600",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.display({
        id: "aksi",
        header: "Aksi",
        meta: { align: "right", nowrap: true },
        cell: ({ row }) => (
          <ButtonLink
            href={`/pegawai/${row.original.id}`}
            variant="outline"
            size="sm"
          >
            Detail
          </ButtonLink>
        ),
      }),
    ]),
  });
}

interface PegawaiTableProps {
  rows: Pegawai[];
  /** Total baris dari API (mode server) */
  rowCount: number;
  tableState: DataTableState;
  loading?: boolean;
  /** Isi checklist filter; null selama belum selesai dimuat */
  options: PegawaiFilterOptions | null;
}

export function PegawaiTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  options,
}: PegawaiTableProps) {
  // kolom dibuat ulang hanya saat isi checklist filter selesai dimuat
  const config = useMemo(() => createPegawaiTableConfig(options), [options]);

  return (
    <DataTable
      config={config}
      data={rows}
      rowCount={rowCount}
      tableState={tableState}
      loading={loading}
    />
  );
}
