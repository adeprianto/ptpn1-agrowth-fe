"use client";

import { useMemo } from "react";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge, Card, type BadgeTone } from "@/components/ui";
import { formatTanggal, orDash } from "@/lib/format";
import type { RiwayatPelatihan } from "../model/pegawai";

const col = createDataTableColumnHelper<RiwayatPelatihan>();

const STATUS_TONE: Record<RiwayatPelatihan["status"], BadgeTone> = {
  Berjalan: "amber",
  Selesai: "emerald",
};

export function createRiwayatPelatihanTableConfig(): TableConfig<RiwayatPelatihan> {
  return defineTableConfig<RiwayatPelatihan>({
    getRowId: (row) => row.id,
    density: "compact",
    defaultPageSize: 10,
    showToolbar: false,
    tableClassName: "min-w-140",
    emptyMessage: "Belum ada riwayat pelatihan.",
    columns: col.columns([
      col.accessor("nama", {
        header: "Pelatihan",
        meta: { cellClassName: "font-medium text-slate-700" },
      }),
      col.accessor("penyelenggara", {
        header: "Penyelenggara",
        meta: { cellClassName: "text-slate-500" },
        cell: ({ getValue }) => orDash(getValue()),
      }),
      col.accessor("tanggalMulai", {
        header: "Tanggal",
        meta: { nowrap: true, cellClassName: "text-slate-500" },
        cell: ({ getValue }) => formatTanggal(getValue(), "short"),
      }),
      col.accessor("jam", {
        header: "Durasi",
        sortFn: "basic",
        meta: { nowrap: true, cellClassName: "text-slate-500" },
        cell: ({ getValue }) => `${getValue()} Jam`,
      }),
      col.accessor("status", {
        header: "Status",
        meta: { nowrap: true },
        cell: ({ row }) => (
          <Badge tone={STATUS_TONE[row.original.status]}>{row.original.status}</Badge>
        ),
      }),
    ]),
  });
}

interface RiwayatPelatihanTableProps {
  rows: RiwayatPelatihan[];
}

export function RiwayatPelatihanTable({ rows }: RiwayatPelatihanTableProps) {
  const config = useMemo(() => createRiwayatPelatihanTableConfig(), []);

  return (
    <Card>
      <h3 className="inline-block border-b-2 border-emerald-500 pb-1 text-base font-bold text-slate-900">
        Riwayat Pelatihan
      </h3>

      <div className="mt-4">
        {/* mode client: riwayat ikut terbawa di respons detail pegawai */}
        <DataTable config={config} data={rows} />
      </div>
    </Card>
  );
}
