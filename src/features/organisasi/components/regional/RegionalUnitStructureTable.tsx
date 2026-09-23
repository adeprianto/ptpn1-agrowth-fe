"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  numberColumn,
  titleColumn,
  useServerDataTable,
  type TableConfig,
} from "@/components/shared/data-table";
import { Alert, Badge, Card, CardHeader } from "@/components/ui";
import { getRegionalUnits } from "../../api/regional";
import { commodityLabel, type Unit } from "../../model/unit";
import { getUnitTypeDisplay } from "../unit/jenisUnit";

const col = createDataTableColumnHelper<Unit>();

/** Versi ringkas tabel unit untuk halaman detail regional. */
export function createRegionalUnitTableConfig(): TableConfig<Unit> {
  return defineTableConfig<Unit>({
    getRowId: (row) => row.id,
    density: "compact",
    defaultPageSize: 6,
    showToolbar: false,
    tableClassName: "min-w-130",
    emptyMessage: "Belum ada unit di bawah regional ini.",
    columns: col.columns([
      titleColumn<Unit>({
        id: "nama",
        header: "Nama Unit",
        value: (row) => row.nama,
        subtitle: (row) => row.kode,
      }),
      col.display({
        id: "jenis",
        header: "Jenis",
        cell: ({ row }) =>
          row.original.jenis.length === 0 ? (
            <span className="text-slate-300">-</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {row.original.jenis.map((item) => {
                const display = getUnitTypeDisplay(item);
                return (
                  <Badge key={item.id} tone={display.tone}>
                    {display.label}
                  </Badge>
                );
              })}
            </div>
          ),
      }),
      numberColumn<Unit>({
        id: "jumlah_karyawan",
        header: "Karyawan",
        value: (row) => row.jumlahKaryawan,
      }),
      col.accessor(commodityLabel, {
        id: "komoditas",
        header: "Komoditas",
        meta: { cellClassName: "text-slate-600" },
      }),
      col.display({
        id: "aksi",
        header: "Aksi",
        meta: { align: "right", nowrap: true },
        cell: ({ row }) => (
          <Link
            href={`/organisasi/unit/${row.original.id}`}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
          >
            Lihat
          </Link>
        ),
      }),
    ]),
  });
}

interface RegionalUnitStructureTableProps {
  regionalId: string;
}

export function RegionalUnitStructureTable({
  regionalId,
}: RegionalUnitStructureTableProps) {
  const config = useMemo(() => createRegionalUnitTableConfig(), []);

  const { tableState, rows, total, loading, error } = useServerDataTable<Unit>({
    defaultPageSize: 6,
    deps: [regionalId],
    fetcher: ({ page, perPage }, signal) =>
      getRegionalUnits(regionalId, { page, perPage }, signal).then((res) => ({
        rows: res.rows,
        total: res.meta?.total ?? res.rows.length,
      })),
  });

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Struktur Unit"
        description="Unit kerja (kebun/pabrik) di bawah region ini."
      />

      {error && (
        <Alert tone="error" className="mt-4">
          Gagal memuat unit: {error}
        </Alert>
      )}

      <div className="mt-4 flex-1">
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
