"use client";

import { useState } from "react";
import { Download, Info } from "lucide-react";
import FormFieldFile from "@/components/shared/FormFieldFile";
import { Alert, Button, Spinner } from "@/components/ui";
import { downloadFile } from "@/lib/download-file";
import { importParticipantsFromExcel, type ImportResult } from "../api/importPeserta";

interface UnggahPesertaExcelProps {
  /** Pelatihan yang dilaporkan; detailnya ikut ditulis di template */
  trainingId?: string;
  /** Dipanggil dengan hasil impor; form mengganti daftar pesertanya dengan hasil ini */
  onImport: (result: ImportResult) => void;
}

/**
 * Tab "Unggah Excel": unduh template, lalu unggah kembali setelah diisi.
 *
 * Alur unggah: pilih file -> `importParticipantsFromExcel` membaca & mencocokkan
 * NIK -> `onImport` mengganti daftar peserta di form -> ringkasan ditampilkan.
 * Karena daftar peserta dipegang form, tabel di tab "Pilih dari Tabel
 * Karyawan" otomatis ikut tercentang sesuai hasil impor.
 */
export function UnggahPesertaExcel({ trainingId, onImport }: UnggahPesertaExcelProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [lastImport, setLastImport] = useState<ImportResult | null>(null);

  /** Unduh template Excel berisi data karyawan sesuai cakupan akun yang login. */
  async function handleDownloadTemplate() {
    if (!trainingId) return;
    setDownloading(true);
    setDownloadError(null);

    try {
      await downloadFile(
        `/api/training-realizations/participants-template?training_id=${trainingId}`,
        "Template-Peserta-Pelatihan.xlsx",
      );
    } catch (error) {
      setDownloadError((error as Error).message);
    } finally {
      setDownloading(false);
    }
  }

  /** Baca file yang dipilih dan pakai hasilnya sebagai daftar peserta. */
  async function handleFileSelect(file: File | null) {
    setImportError(null);
    setLastImport(null);
    if (!file) return; // file dibatalkan dari kotak unggah

    setImporting(true);
    try {
      const result = await importParticipantsFromExcel(file);
      onImport(result);
      setLastImport(result);
    } catch (error) {
      setImportError((error as Error).message);
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-slate-50 p-4">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>
            Unduh template, isi satu karyawan per baris dengan kolom <b>NIK</b> dan
            biayanya, lalu unggah kembali. Daftar peserta yang sudah dipilih akan
            <b> diganti</b> dengan isi file.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          loading={downloading}
          // id pelatihan belum ada selama data laporan (mode ubah) masih dimuat
          disabled={!trainingId}
          onClick={handleDownloadTemplate}
        >
          {/* data karyawan HO bisa puluhan ribu baris, jadi prosesnya bisa agak lama */}
          {downloading ? "Menyiapkan template..." : "Unduh Template"}
        </Button>
      </div>

      {downloadError && (
        <Alert tone="error" onDismiss={() => setDownloadError(null)}>
          Gagal mengunduh template: {downloadError}
        </Alert>
      )}

      <FormFieldFile onFileSelect={handleFileSelect} />

      {importing && (
        <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Spinner size="sm" /> Membaca file dan mencocokkan NIK...
        </p>
      )}

      {importError && (
        <Alert tone="error" onDismiss={() => setImportError(null)}>
          Gagal mengimpor peserta: {importError}
        </Alert>
      )}

      {lastImport && (
        <Alert tone="success" onDismiss={() => setLastImport(null)}>
          {lastImport.peserta.length} peserta berhasil diimpor dan menggantikan daftar
          peserta sebelumnya.
          {lastImport.biayaPelatihan && " Biaya Pelatihan per Peserta ikut diisi dari file."}
        </Alert>
      )}

      {lastImport && lastImport.dilewati.length > 0 && (
        <Alert tone="warning" title={`${lastImport.dilewati.length} baris dilewati:`}>
          <ul className="list-disc pl-5">
            {lastImport.dilewati.map((pesan) => (
              <li key={pesan}>{pesan}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}
