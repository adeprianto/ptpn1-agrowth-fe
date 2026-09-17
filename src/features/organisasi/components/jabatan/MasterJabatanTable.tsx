import Link from "next/link";
import {
  getEntityLabel,
  getJobFamilyName,
  getOrganisasiNode,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";

interface MasterJabatanTableProps {
  rows: JabatanMasterRow[];
  onDeleteClick: (row: JabatanMasterRow) => void;
}

export function MasterJabatanTable({
  rows,
  onDeleteClick,
}: MasterJabatanTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-190 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-6 py-4">No</th>
            <th className="px-4 py-4">Code</th>
            <th className="px-6 py-4">Nama Jabatan</th>
            <th className="px-6 py-4">Level</th>
            <th className="px-6 py-4">Job Family</th>
            <th className="px-6 py-4">Organisasi</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const organisasi = getOrganisasiNode(row.organisasiCode);

            return (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-6 py-4 text-slate-500">{row.id}</td>
                <td className="px-4 py-4 text-slate-500">{row.code}</td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  {row.namaJabatanLengkap}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full whitespace-nowrap bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {row.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {getJobFamilyName(row.jobFamilyCode)}
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-700">{organisasi?.name ?? "-"}</p>
                  <p className="text-xs text-slate-400">
                    {organisasi ? getEntityLabel(organisasi.entityCode) : ""}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/organisasi/jabatan/${row.id}/edit`}
                      className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                    >
                      Edit
                    </Link>
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
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                Tidak ada jabatan yang cocok dengan pencarian/filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
