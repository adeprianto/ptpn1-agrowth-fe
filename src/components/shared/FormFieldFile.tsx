"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileSpreadsheet, FileUp, X } from "lucide-react";
import { cn } from "cn";

const ALLOWED_EXTENSIONS = ["xlsx", "xls", "csv"];

interface FormFieldFileProps {
  /** Dipanggil dengan file yang lolos validasi, atau `null` saat file dibatalkan */
  onFileSelect?: (file: File | null) => void;
  maxSizeMB?: number;
}

/**
 * Kotak unggah spreadsheet: tarik-lepas file ke kotak, atau klik tombol
 * untuk memilih dari komputer. Hanya menerima .xlsx, .xls, dan .csv.
 *
 * Alurnya: file masuk (drop / pilih) -> `checkFile` -> kalau lolos, nama
 * file ditampilkan dan `onFileSelect` dipanggil.
 */
export default function FormFieldFile({ onFileSelect, maxSizeMB = 50 }: FormFieldFileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Pesan error kalau file tidak boleh diunggah; `null` kalau lolos. */
  function checkFile(candidate: File): string | null {
    const extension = candidate.name.split(".").pop()?.toLowerCase() ?? "";

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return "Format file tidak didukung. Harap unggah .XLSX, .XLS, atau .CSV";
    }
    if (candidate.size > maxSizeMB * 1024 * 1024) {
      return `Ukuran file melebihi batas maksimal (${maxSizeMB} MB)`;
    }
    return null;
  }

  function receiveFile(candidate: File | undefined) {
    if (!candidate) return;

    const message = checkFile(candidate);
    setError(message);
    if (message) return;

    setFile(candidate);
    onFileSelect?.(candidate);
  }

  function removeFile() {
    setFile(null);
    setError(null);
    onFileSelect?.(null);
    // supaya file yang sama bisa dipilih lagi
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    // abaikan saat kursor hanya pindah ke elemen di dalam kotak (mencegah kedip)
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    receiveFile(event.dataTransfer.files[0]);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    receiveFile(event.target.files?.[0]);
  }

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          // tata letak
          "flex flex-col items-center justify-center",
          // tampilan
          "rounded-2xl border-2 border-dashed p-10",
          // teks
          "text-center",
          // gerak
          "transition-colors duration-200",
          // keadaan
          isDragging
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-emerald-200/80 bg-white hover:bg-emerald-200/10",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleChange}
          className="hidden"
        />

        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <FileUp className="h-7 w-7" />
        </div>

        <h3 className="mb-1 text-base font-semibold text-slate-800">
          {isDragging ? "Lepaskan berkas di sini" : "Tarik dan lepas berkas spreadsheet ke sini"}
        </h3>
        <p className="mb-6 text-sm text-slate-500">
          Format file yang didukung: .XLSX, .XLS, atau .CSV (Maksimal {maxSizeMB} MB)
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Pilih Berkas Komputer
        </button>
      </div>

      {error && <p className="text-center text-sm font-medium text-rose-500">{error}</p>}

      {file && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <FileSpreadsheet className="h-5 w-5 shrink-0 text-emerald-700" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            aria-label={`Hapus berkas ${file.name}`}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
