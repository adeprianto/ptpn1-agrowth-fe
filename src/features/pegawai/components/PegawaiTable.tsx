"use client";

import { useMemo } from "react";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  toFilterOptions,
  toValueOptions,
  type DataTableState,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge, ButtonLink } from "@/components/ui";
import { getUnitTypeDisplay } from "@/features/organisasi/components/unit/jenisUnit";
import { ENTITY_TIPE_LABEL } from "@/features/organisasi/model/entity";
import { orDash } from "@/lib/format";
import {
  levelBodLabel,
  operationalLabel,
  type Pegawai,
  type PegawaiFilterOptions,
} from "../model/pegawai";

const col = createDataTableColumnHelper<Pegawai>();

/** Label "Kebun · Teh" untuk satu baris operasional pegawai. */
export function employeeOperationalLabel(pegawai: Pegawai) {
  const jenis = pegawai.operasionalJenis
    ? getUnitTypeDisplay(pegawai.operasionalJenis)
    : null;

  return operationalLabel(jenis, pegawai.operasionalKomoditas);
}

/**
 * Isi daftar centang tiap kolom, dirakit dari hasil
 * GET /api/employees/filter-options. Kosong selama belum selesai dimuat.
 */
function buildChecklistOptions(options: PegawaiFilterOptions | null) {
  return {
    entity:
      options?.entities.map((entity) => ({
        value: entity.id,
        label: entity.nama,
        group: ENTITY_TIPE_LABEL[entity.tipe],
      })) ?? [],
    // Head Office ikut masuk daftar ini karena pegawainya tidak bernaung
    // di regional mana pun
    regional:
      options?.regionals.map((regional) => ({
        value: regional.id,
        label: regional.nama,
      })) ?? [],
    operasional:
      options?.operasional.map((row) => ({
        value: row.key,
        label: operationalLabel(
          row.jenis ? getUnitTypeDisplay(row.jenis) : null,
          row.komoditas,
        ),
      })) ?? [],
    jobGroup: toFilterOptions(options?.jobGroups),
    jobFunction: toFilterOptions(options?.jobFunctions),
    level:
      options?.levelBod.map((level) => ({
        value: String(level),
        label: levelBodLabel(level),
      })) ?? [],
    golonganPhdp: toValueOptions(options?.golonganPhdp),
    personGrade: toValueOptions(options?.personGrade),
  };
}

/**
 * Konfigurasi tabel pegawai.
 *
 * Id kolom sengaja sama dengan nama parameter sort/filter di backend (lihat
 * EmployeeController::SORTABLE), jadi `PegawaiList` bisa meneruskannya
 * langsung ke API tanpa tabel penerjemah.
 */
export function createEmployeeTableConfig(
  options: PegawaiFilterOptions | null,
): TableConfig<Pegawai> {
  const checklist = buildChecklistOptions(options);

  return defineTableConfig<Pegawai>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-320",
    density: "compact",
    emptyMessage: "Tidak ada pegawai yang cocok dengan pencarian atau filter.",
    columns: col.columns([
      col.accessor("nik", {
        header: "NIK (SAP)",
        meta: {
          search: { placeholder: "Cari NIK..." },
          nowrap: true,
          cellClassName: "font-mono text-xs text-slate-600",
        },
      }),
      col.accessor("nama", {
        id: "name",
        header: "Nama Pegawai",
        meta: { search: { placeholder: "Cari nama..." } },
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-800">{getValue()}</span>
        ),
      }),
      col.accessor("regional", {
        id: "regional",
        header: "Regional",
        meta: {
          filter: { options: checklist.regional },
          nowrap: true,
          cellClassName: "text-slate-700",
        },
      }),
      col.accessor("penempatanNama", {
        id: "entity",
        header: "Entity",
        meta: { filter: { options: checklist.entity } },
        cell: ({ row }) => (
          <>
            <p className="text-slate-700">{row.original.penempatanNama}</p>
            {row.original.penempatanInduk && (
              <p className="text-xs text-slate-400">{row.original.penempatanInduk}</p>
            )}
          </>
        ),
      }),
      col.accessor(employeeOperationalLabel, {
        id: "operasional",
        header: "Entity Operational",
        meta: { filter: { options: checklist.operasional } },
        cell: ({ row, getValue }) =>
          row.original.operasionalJenis || row.original.operasionalKomoditas ? (
            <Badge tone={getUnitTypeDisplay(row.original.operasionalJenis).tone}>
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
          search: { placeholder: "Cari jabatan..." },
          cellClassName: "text-slate-700",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("jobGroup", {
        id: "job_group",
        header: "Job Group",
        meta: {
          filter: { options: checklist.jobGroup },
          cellClassName: "text-slate-600",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("jobFunction", {
        id: "job_function",
        header: "Job Function",
        meta: {
          filter: { options: checklist.jobFunction },
          cellClassName: "text-slate-600",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("levelBod", {
        id: "level",
        header: "Level",
        meta: {
          filter: { options: checklist.level },
          nowrap: true,
          cellClassName: "font-medium text-slate-700",
        },
        cell: ({ getValue }) => levelBodLabel(getValue()),
      }),
      col.accessor("golonganPhdp", {
        id: "golongan_phdp",
        header: "Gol. PHDP",
        meta: {
          filter: { options: checklist.golonganPhdp },
          nowrap: true,
          cellClassName: "text-slate-600",
        },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("personGrade", {
        id: "person_grade",
        header: "Person Grade",
        meta: {
          filter: { options: checklist.personGrade },
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
  /** Isi daftar centang; null selama belum selesai dimuat */
  options: PegawaiFilterOptions | null;
}

export function PegawaiTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  options,
}: PegawaiTableProps) {
  // kolom dibuat ulang hanya saat isi daftar centang selesai dimuat
  const config = useMemo(() => createEmployeeTableConfig(options), [options]);

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
