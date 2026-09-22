/**
 * Pemformat nilai untuk tampilan. Semua pakai locale id-ID supaya konsisten
 * di seluruh aplikasi — jangan panggil `toLocaleString` langsung di komponen.
 */

const BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const BULAN_PENDEK = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
];

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

/**
 * "2026-07-18" -> "18 Juli 2026" (long) / "18 Jul 2026" (short).
 * Diparse manual supaya tanggalnya tidak bergeser karena timezone.
 */
export function formatTanggal(
  iso: string | null | undefined,
  variant: "long" | "short" = "long",
): string {
  if (!iso) return "-";

  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;

  const bulan = (variant === "long" ? BULAN_PANJANG : BULAN_PENDEK)[month - 1];
  return `${day} ${bulan} ${year}`;
}

/** "2025-03-01" + "2025-03-05" -> "1 Mar 2025 - 5 Mar 2025" */
export function formatRentangTanggal(
  mulai: string | null | undefined,
  selesai: string | null | undefined,
): string {
  if (!mulai && !selesai) return "-";
  return `${formatTanggal(mulai, "short")} - ${formatTanggal(selesai, "short")}`;
}

/** Selisih dari tanggal ISO sampai hari ini, mis. "29 Thn 8 Bln" */
export function formatMasaKerja(iso: string | null | undefined): string {
  if (!iso) return "-";

  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return "-";

  const now = new Date();
  let months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  if (now.getDate() < day) months -= 1;
  if (months < 0) return "-";

  return `${Math.floor(months / 12)} Thn ${months % 12} Bln`;
}

/** Tampilkan nilai apa adanya, ganti kosong/null dengan "-" */
export function orDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  const text = String(value).trim();
  return text === "" ? "-" : text;
}

/** Gabungkan beberapa nilai jadi satu baris, lewati yang kosong. */
export function joinOrDash(
  values: (string | null | undefined)[],
  separator = " · ",
): string {
  return values.filter(Boolean).join(separator) || "-";
}
