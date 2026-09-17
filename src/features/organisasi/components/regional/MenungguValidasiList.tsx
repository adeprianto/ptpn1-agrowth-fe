import { StatusBadge, type StatusKey } from "@/components/shared/StatusBadge";
import type { PendingValidationRow } from "./regionalDetailDummyData";

// Beberapa status di desain pakai label spesifik ("Ditolak Regional") yang
// beda dari label default StatusBadge ("Ditolak") — di-override lewat prop `label`.
const statusLabelOverride: Partial<Record<StatusKey, string>> = {
  ditolak: "Ditolak Regional",
};

interface MenungguValidasiListProps {
  rows: PendingValidationRow[];
}

export function MenungguValidasiList({ rows }: MenungguValidasiListProps) {
  return (
    <ul className="divide-y divide-slate-50">
      {rows.map((row) => (
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
          <StatusBadge
            status={row.status}
            label={statusLabelOverride[row.status]}
          />
        </li>
      ))}
    </ul>
  );
}
