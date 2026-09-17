import { StatusBadge, type BadgeTone } from "@/components/shared/StatusBadge";
import type {
  TrainingHistoryRow,
  TrainingStatus,
} from "./pegawaiDetailDummyData";

const trainingStatusTone: Record<TrainingStatus, BadgeTone> = {
  Berjalan: "amber",
  Selesai: "emerald",
};

interface RiwayatPelatihanTableProps {
  rows: TrainingHistoryRow[];
}

export function RiwayatPelatihanTable({ rows }: RiwayatPelatihanTableProps) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-5">
      <h3 className="inline-block border-b-2 border-emerald-500 pb-1 text-base font-bold text-slate-900">
        Riwayat Pelatihan
      </h3>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-140 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="py-3 pr-4">Pelatihan</th>
              <th className="py-3 pr-4">Penyelenggara</th>
              <th className="py-3 pr-4">Tanggal</th>
              <th className="py-3 pr-4">Durasi</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-3 pr-4 font-medium text-slate-700">
                  {row.nama}
                </td>
                <td className="py-3 pr-4 text-slate-500">{row.provider}</td>
                <td className="py-3 pr-4 text-slate-500">{row.tanggal}</td>
                <td className="py-3 pr-4 text-slate-500">{row.jam} Jam</td>
                <td className="py-3">
                  <StatusBadge
                    tone={trainingStatusTone[row.status]}
                    label={row.status}
                  />
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm text-slate-400"
                >
                  Belum ada riwayat pelatihan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
