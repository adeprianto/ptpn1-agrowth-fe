/**
 * Pemformat nilai untuk tampilan. Semua pakai locale id-ID supaya konsisten
 * di seluruh aplikasi — jangan panggil `toLocaleString` langsung di komponen.
 */

/** 4500 -> "4.500"; null/undefined -> "-" */
export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined ? "-" : value.toLocaleString("id-ID");
}

/** 1250000 -> "Rp 1.250.000" */
export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** "2025-03-17" -> "17 Mar 2025" */
export function formatTanggal(iso: string | null | undefined): string {
  if (!iso) return "-";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "2025-03-01" + "2025-03-05" -> "1 Mar 2025 - 5 Mar 2025" */
export function formatRentangTanggal(
  mulai: string | null | undefined,
  selesai: string | null | undefined,
): string {
  if (!mulai && !selesai) return "-";
  return `${formatTanggal(mulai)} - ${formatTanggal(selesai)}`;
}

/** Tampilkan nilai teks apa adanya, ganti kosong/null dengan "-" */
export function orDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  const text = String(value).trim();
  return text === "" ? "-" : text;
}
