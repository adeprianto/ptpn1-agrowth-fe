const BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const BULAN_PENDEK = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
];

/**
 * "2026-07-18" -> "18 Juli 2026" (long) / "18 Jul 2026" (short).
 * Diparse manual supaya tidak bergeser hari karena timezone.
 */
export function formatTanggal(
  iso: string | null | undefined,
  variant: "long" | "short" = "long",
): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const bulan = (variant === "long" ? BULAN_PANJANG : BULAN_PENDEK)[m - 1];
  return `${d} ${bulan} ${y}`;
}

/** Selisih dari tanggal ISO sampai hari ini, mis. "29 Thn 8 Bln" */
export function formatMasaKerja(iso: string | null | undefined): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  if (now.getDate() < d) months -= 1;
  if (months < 0) return "-";
  return `${Math.floor(months / 12)} Thn ${months % 12} Bln`;
}
