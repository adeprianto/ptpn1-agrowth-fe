/**
 * Unduh file dari route handler Next (path "/api/..."), mis. template Excel.
 *
 * Berbeda dengan `apiGet`, responsnya berupa file biner, bukan JSON. Kalau
 * gagal, backend tetap membalas JSON `{ success, message }`, jadi pesannya
 * dilempar sebagai `ApiError` — sama seperti request lain di aplikasi.
 */
import { ApiError } from "./http-client";

export async function downloadFile(path: string, fileName: string): Promise<void> {
  // cookie sesi ikut terkirim otomatis karena satu origin
  const response = await fetch(path);

  if (!response.ok) {
    const json = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(response.status, json?.message ?? `Unduhan gagal (${response.status})`);
  }

  // Simpan file: buat URL sementara dari isi file, klik tautan unduh, lalu bersihkan.
  saveBlob(await response.blob(), fileName);
}

/** Simpan isi file yang sudah ada di browser, mis. Excel yang dibuat di sisi klien. */
export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
