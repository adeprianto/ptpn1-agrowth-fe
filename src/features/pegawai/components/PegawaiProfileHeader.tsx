import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";

interface PegawaiProfileHeaderProps {
  nama: string;
  /** Kode SAP */
  nik: string;
  jabatan: string | null;
  penempatanNama: string;
  penempatanInduk: string | null;
  backHref: string;
  /** Kosongkan untuk menyembunyikan tombol Edit (belum ada endpoint ubah pegawai) */
  editHref?: string;
}

function getInitials(nama: string): string {
  return nama
    .replace(/[^A-Za-z\s]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function PegawaiProfileHeader({
  nama,
  nik,
  jabatan,
  penempatanNama,
  penempatanInduk,
  backHref,
  editHref,
}: PegawaiProfileHeaderProps) {
  const penempatan = [penempatanNama, penempatanInduk].filter(Boolean).join(", ");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          aria-label="Kembali ke daftar pegawai"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-lg font-bold text-white">
          {getInitials(nama)}
        </div>

        <div>
          <p className="text-lg font-bold text-slate-900">{nama}</p>
          <p className="text-sm text-slate-400">{nik}</p>
          <p className="text-sm text-slate-500">
            {[jabatan, penempatan].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {editHref && (
        <Link
          href={editHref}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
        >
          <Pencil className="h-4 w-4" />
          Edit Karyawan
        </Link>
      )}
    </div>
  );
}
