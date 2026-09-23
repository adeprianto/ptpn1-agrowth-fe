"use client";

import { Download, Info } from "lucide-react";
import FormFieldFile from "@/components/shared/FormFieldFile";
import { Button } from "@/components/ui";

/**
 * Tampilan tab "Unggah Excel" untuk menambahkan peserta dari spreadsheet.
 *
 * BELUM TERSAMBUNG — baru tampilannya saja. Untuk menyambungkannya nanti:
 * 1. Tangkap file lewat `onFileSelect` milik `FormFieldFile`
 * 2. Baca daftar NIK dari file, cari karyawannya lewat API
 * 3. Tambahkan hasilnya ke daftar peserta form (sama seperti centang di tabel)
 */
export function UnggahPesertaExcel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-slate-50 p-4">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>
            Isi satu karyawan per baris dengan kolom <b>NIK</b>. Karyawan yang
            ditemukan akan ditambahkan ke daftar peserta terpilih.
          </p>
        </div>

        {/* belum tersambung ke file template */}
        <Button variant="outline" size="sm" icon={Download} disabled>
          Unduh Template
        </Button>
      </div>

      <FormFieldFile />
    </div>
  );
}
