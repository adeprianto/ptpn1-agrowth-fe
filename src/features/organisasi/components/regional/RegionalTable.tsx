import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { RegionalRow } from "./regionalDummyData";

interface RegionalTableProps {
  rows: RegionalRow[];
  onDeleteClick: (row: RegionalRow) => void;
  onEditClick: (row: RegionalRow) => void;
}

export function RegionalTable({
  rows,
  onEditClick,
  onDeleteClick,
}: RegionalTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white ">
      <table className="w-full min-w-180 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-6 py-4">No</th>
            <th className="px-6 py-4">Regional</th>
            <th className="px-6 py-4">Wilayah</th>
            <th className="px-6 py-4">Unit</th>
            <th className="px-6 py-4">Karyawan</th>
            {/* <th className="px-6 py-4">Kepala Regional</th> */}
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-50 last:border-0">
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{row.id}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{row.nama}</p>
                <p className="text-xs text-slate-400">{row.kode}</p>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-4 w-4 text-slate-300" />
                  {row.wilayah}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  {row.jumlahUnit} Unit
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Users className="h-4 w-4 text-slate-300" />
                  {row.jumlahKaryawan}
                </span>
              </td>
              {/* <td className="px-6 py-4 text-slate-600">{row.kepalaRegional}</td> */}
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/organisasi/regional/${row.id}`}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => onEditClick(row)}
                    className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClick(row)}
                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                Tidak ada regional yang cocok dengan pencarian/filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
