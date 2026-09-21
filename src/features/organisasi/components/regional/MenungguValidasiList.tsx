import { StatusBadge } from "@/components/shared/StatusBadge";
import { statusConfig } from "@/components/shared/PengajuanPelatihanList";
import type { PendingValidationRow } from "./regionalDetailDummyData";

interface MenungguValidasiListProps {
  rows: PendingValidationRow[];
}

export function MenungguValidasiList({ rows }: MenungguValidasiListProps) {
  return (
    <ul className="divide-y divide-slate-50">
      {rows.map((row) => {
        const config = statusConfig[row.status];

        return (
          <li
            key={row.id}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {row.namaPelatihan}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {row.namaUnit} · Diajukan {row.tanggalDiajukan}
              </p>
            </div>
            <StatusBadge tone={config.tone} label={config.label} />
          </li>
        );
      })}
    </ul>
  );
}
