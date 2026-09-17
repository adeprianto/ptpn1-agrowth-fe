import Link from "next/link";
import type { UnitStructureRow } from "./regionalDetailDummyData";

interface RegionalUnitStructureTableProps {
  rows: UnitStructureRow[];
}

const jenisBadgeClass: Record<UnitStructureRow["jenis"], string> = {
  Kebun: "bg-emerald-100 text-emerald-700",
  Pabrik: "bg-blue-100 text-blue-700",
};

export function RegionalUnitStructureTable({
  rows,
}: RegionalUnitStructureTableProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-300 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">Struktur Unit</h3>
      <p className="mt-1 text-sm text-slate-400">
        Unit kerja (kebun/pabrik) di bawah region ini.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-130 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="py-3 pr-4">Nama Unit</th>
              <th className="py-3 pr-4">Jenis</th>
              <th className="py-3 pr-4">Karyawan</th>
              <th className="py-3 pr-4">Kepala Unit</th>
              <th className="py-3 text-right">Action</th>
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
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${jenisBadgeClass[row.jenis]}`}
                  >
                    {row.jenis}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-500">{row.karyawan}</td>
                <td className="py-3 pr-4 text-slate-600">{row.kepalaUnit}</td>
                <td className="py-3 text-right">
                  <Link
                    href={`/organisasi/unit/${row.id}`}
                    className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    Lihat
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
