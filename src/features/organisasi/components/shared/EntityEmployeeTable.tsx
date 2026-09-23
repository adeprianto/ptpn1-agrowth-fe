"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  filterText,
  rowNumberColumn,
  titleColumn,
  useServerDataTable,
  type TableConfig,
} from "@/components/shared/data-table";
import { Alert, Badge, Card, CardHeader } from "@/components/ui";
import { getEmployeeList } from "@/features/pegawai/api/pegawai";
import {
  levelBodLabel,
  statusTone,
  type Pegawai,
} from "@/features/pegawai/model/pegawai";
import { orDash } from "@/lib/format";

const col = createDataTableColumnHelper<Pegawai>();

/** Versi ringkas tabel pegawai untuk halaman detail entity. */
export function createEntityEmployeeTableConfig(
  startIndex: number,
): TableConfig<Pegawai> {
  return defineTableConfig<Pegawai>({
    getRowId: (row) => row.id,
    density: "compact",
    tableClassName: "min-w-160",
    emptyMessage: "Tidak ada karyawan yang cocok dengan pencarian.",
    columns: col.columns([
      rowNumberColumn<Pegawai>(startIndex),
      titleColumn<Pegawai>({
        id: "search",
        header: "Pegawai",
        value: (row) => row.nama,
        subtitle: (row) => row.nik,
        search: { placeholder: "Cari nama atau kode SAP..." },
      }),
      col.accessor("jabatan", {
        id: "posisi",
        header: "Posisi",
        cell: ({ row }) => (
          <>
            <p className="text-slate-700">{orDash(row.original.jabatan)}</p>
            <p className="text-xs text-slate-400">{orDash(row.original.jobGroup)}</p>
          </>
        ),
      }),
      col.accessor("levelBod", {
        id: "level",
        header: "Level",
        meta: { nowrap: true, cellClassName: "text-slate-500" },
        cell: ({ getValue }) => levelBodLabel(getValue()),
      }),
      col.accessor("status", {
        id: "status",
        header: "Status",
        meta: { nowrap: true },
        cell: ({ row }) => (
          <Badge tone={statusTone(row.original.status)}>
            {orDash(row.original.status)}
          </Badge>
        ),
      }),
      col.display({
        id: "aksi",
        header: "Aksi",
        meta: { align: "right", nowrap: true },
        cell: ({ row }) => (
          <Link
            href={`/pegawai/${row.original.id}`}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
          >
            Lihat
          </Link>
        ),
      }),
    ]),
  });
}

interface EntityEmployeeTableProps {
  /** Entity (HO/Regional/Unit) yang karyawannya ditampilkan */
  entityId: string;
  title?: string;
  subtitle?: string;
}

/** Daftar karyawan pada satu entity — dipakai di halaman detail entity. */
export function EntityEmployeeTable({
  entityId,
  title = "Daftar Karyawan",
  subtitle,
}: EntityEmployeeTableProps) {
  const { tableState, rows, total, loading, error, startIndex } =
    useServerDataTable<Pegawai>({
      deps: [entityId],
      fetcher: ({ filters, page, perPage }, signal) =>
        getEmployeeList(
          {
            entityId,
            // backend mencari di nama maupun NIK lewat satu parameter `search`
            search: filterText(filters.search),
            page,
            perPage,
          },
          signal,
        ).then((res) => ({
          rows: res.rows,
          total: res.meta?.total ?? res.rows.length,
        })),
    });

  const config = useMemo(
    () => createEntityEmployeeTableConfig(startIndex),
    [startIndex],
  );

  return (
    <Card>
      <CardHeader title={title} description={subtitle} />

      {error && (
        <Alert tone="error" className="mt-4">
          Gagal memuat daftar karyawan: {error}
        </Alert>
      )}

      <div className="mt-4">
        <DataTable
          config={config}
          data={rows}
          rowCount={total}
          tableState={tableState}
          loading={loading}
        />
      </div>
    </Card>
  );
}
