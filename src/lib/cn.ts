/**
 * Gabungkan beberapa className jadi satu string, mengabaikan nilai kosong.
 *
 *   cn("px-3", isActive && "bg-emerald-600", className)
 *
 * Sengaja tanpa dependensi: proyek ini tidak memakai varian Tailwind yang
 * saling bertabrakan pada komponen yang sama, jadi penggabungan sederhana
 * sudah cukup dan urutan terakhir tetap menang di CSS.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
