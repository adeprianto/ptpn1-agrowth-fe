import type { UnitPositionRow } from "./unitDetailDummyData";

function getBarColorClass(terisi: number, kuota: number): string {
  const ratio = kuota > 0 ? terisi / kuota : 0;
  if (ratio >= 1) return "bg-emerald-400";
  if (ratio >= 0.5) return "bg-amber-400";
  return "bg-rose-400";
}

interface UnitPositionTableProps {
  rows: UnitPositionRow[];
}

export function UnitPositionTable({ rows }: UnitPositionTableProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">Struktur Posisi</h3>
      <p className="mt-1 text-sm text-slate-400">
        Posisi/Jabatan yang tersedia di unit ini
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-130 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="py-3 pr-4">Posisi</th>
              <th className="py-3 pr-4">Departemen</th>
              <th className="py-3">Karyawan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const ratio =
                row.kuota > 0 ? Math.min(row.terisi / row.kuota, 1) : 0;
              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-slate-700">
                    {row.posisi}
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{row.departemen}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-xs text-slate-500">
                        {row.terisi}/{row.kuota}
                      </span>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${getBarColorClass(row.terisi, row.kuota)}`}
                          style={{ width: `${ratio * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-sm text-slate-400"
                >
                  Belum ada data struktur posisi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
