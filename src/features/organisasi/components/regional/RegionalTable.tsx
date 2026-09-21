import { Eye, Pencil, Trash2, Users } from "lucide-react";
import { RowActionMenu } from "@/components/shared/RowActionMenu";
import type { Regional } from "../../api/regional";

interface RegionalTableProps {
  rows: Regional[];
  /** Nomor urut baris pertama (untuk kolom No di halaman > 1) */
  startIndex: number;
  loading?: boolean;
  emptyMessage?: string;
  onEditClick: (row: Regional) => void;
  onDeleteClick: (row: Regional) => void;
}

export function RegionalTable({
  rows,
  startIndex,
  loading = false,
  emptyMessage = "Tidak ada regional yang cocok dengan pencarian.",
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
            <th className="px-6 py-4">Unit</th>
            <th className="px-6 py-4">Karyawan</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className={loading ? "opacity-50" : undefined}>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-b border-slate-50 last:border-0">
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{startIndex + index}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{row.nama}</p>
                <p className="text-xs text-slate-400">{row.kode}</p>
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  {row.jumlahUnit} Unit
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Users className="h-4 w-4 text-slate-300" />
                  {row.jumlahKaryawan.toLocaleString("id-ID")}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <RowActionMenu
                    label={`Aksi untuk ${row.nama}`}
                    actions={[
                      {
                        label: "Lihat Detail",
                        icon: Eye,
                        href: `/organisasi/regional/${row.id}`,
                      },
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => onEditClick(row),
                      },
                      {
                        label: "Hapus",
                        icon: Trash2,
                        variant: "danger",
                        onClick: () => onDeleteClick(row),
                      },
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                {loading ? "Memuat data regional..." : emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
