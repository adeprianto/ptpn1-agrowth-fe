/**
 * Aturan validasi form yang dipakai SEMUA form di aplikasi.
 *
 * Setiap aturan mengembalikan pesan error, atau `undefined` kalau isiannya
 * sudah benar. Format pesannya seragam:
 *
 *   "<Label> wajib diisi"                  kotak isian masih kosong
 *   "<Label> wajib dipilih"                dropdown / pilihan masih kosong
 *   "Format <Label> tidak valid"           isian ada, tapi bentuknya salah
 *   "<Label> harus antara <min> dan <max>" angka di luar batas
 *   "<Label> tidak boleh sebelum <Label>"  urutan tanggal terbalik
 *
 * Cara pakai di form — satu baris per isian, lalu serahkan ke `useFormSubmit`:
 *
 *   validate: (form) => ({
 *     nama: requireText(form.nama, "Nama Unit"),
 *     regionalId: requireSelection(form.regionalId, "Regional"),
 *     // beberapa aturan untuk satu isian digabung dengan `??`:
 *     // aturan pertama yang gagal, pesannya yang ditampilkan
 *     email: requireText(form.email, "Email") ?? mustBeEmail(form.email, "Email"),
 *   }),
 *
 * Aturan format (`mustBeNumeric`, `mustBeEmail`, `numberBetween`, `notBefore`) tidak memeriksa
 * isian kosong — pasangkan dengan `requireText` kalau isiannya wajib.
 */

/** Kotak isian teks/angka/tanggal wajib diisi. */
export function requireText(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label} wajib diisi`;
}

/** Dropdown atau pilihan wajib dipilih. */
export function requireSelection(value: string, label: string): string | undefined {
  return value ? undefined : `${label} wajib dipilih`;
}

/** Hanya boleh berisi angka, mis. NIK. */
export function mustBeNumeric(value: string, label: string): string | undefined {
  if (!value.trim()) return undefined;
  return /^\d+$/.test(value.trim()) ? undefined : `Format ${label} tidak valid`;
}

/** Harus berbentuk alamat email, mis. nama@ptpn1.co.id. */
export function mustBeEmail(value: string, label: string): string | undefined {
  if (!value.trim()) return undefined;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? undefined
    : `Format ${label} tidak valid`;
}

/** Angka harus berada di antara `min` dan `max` (keduanya ikut dihitung). */
export function numberBetween(
  value: string,
  label: string,
  min: number,
  max: number,
): string | undefined {
  if (!value.trim()) return undefined;
  const angka = Number(value);
  return angka >= min && angka <= max ? undefined : `${label} harus antara ${min} dan ${max}`;
}

/**
 * Tanggal tidak boleh lebih awal dari tanggal pembandingnya.
 * Tanggal berformat "YYYY-MM-DD", jadi cukup dibandingkan sebagai teks.
 */
export function notBefore(
  tanggal: string,
  label: string,
  tanggalAwal: string,
  labelAwal: string,
): string | undefined {
  if (!tanggal || !tanggalAwal) return undefined;
  return tanggal < tanggalAwal ? `${label} tidak boleh sebelum ${labelAwal}` : undefined;
}
