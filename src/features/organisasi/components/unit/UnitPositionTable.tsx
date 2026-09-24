"use client";

import { useMemo } from "react";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  type TableConfig,
} from "@/components/shared/data-table";
import { Card, CardHeader } from "@/components/ui";
import type { UnitPositionRow } from "./unitDetailDummyData";
import { cn } from "cn";

const col = createDataTableColumnHelper<UnitPositionRow>();

/** Hijau kalau kuota terpenuhi, kuning kalau separuh, merah kalau kurang. */
function barColorClass(terisi: number, kuota: number): string {
  const ratio = kuota > 0 ? terisi / kuota : 0;
  if (ratio >= 1) return "bg-emerald-400";
  if (ratio >= 0.5) return "bg-amber-400";
  return "bg-rose-400";
}

export function createUnitPositionTableConfig(): TableConfig<UnitPositionRow> {
  return defineTableConfig<UnitPositionRow>({
    getRowId: (row) => row.id,
    density: "compact",
    defaultPageSize: 8,
    showToolbar: false,
    tableClassName: "min-w-130",
    emptyMessage: "Belum ada data struktur posisi.",
    columns: col.columns([
      col.accessor("posisi", {
        header: "Posisi",
        meta: { cellClassName: "font-medium text-slate-700" },
      }),
      col.accessor("departemen", {
        header: "Departemen",
        meta: { cellClassName: "text-slate-500" },
      }),
      col.accessor((row) => (row.kuota > 0 ? row.terisi / row.kuota : 0), {
        id: "karyawan",
        header: "Karyawan",
        sortFn: "basic",
        cell: ({ row, getValue }) => (
          <div className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-xs text-slate-500">
              {row.original.terisi}/{row.original.kuota}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  // tampilan — warnanya mengikuti rasio terisi/kuota
                  "h-full rounded-full",
                  barColorClass(row.original.terisi, row.original.kuota),
                )}
                style={{ width: `${Math.min(getValue() as number, 1) * 100}%` }}
              />
            </div>
          </div>
        ),
      }),
    ]),
  });
}

interface UnitPositionTableProps {
  rows: UnitPositionRow[];
}

export function UnitPositionTable({ rows }: UnitPositionTableProps) {
  const config = useMemo(() => createUnitPositionTableConfig(), []);

  return (
    <Card className="h-full">
      <CardHeader
        title="Struktur Posisi"
        description="Posisi/Jabatan yang tersedia di unit ini"
      />
      <div className="mt-4">
        {/* mode client: data posisi sudah lengkap di browser */}
        <DataTable config={config} data={rows} />
      </div>
    </Card>
  );
}
