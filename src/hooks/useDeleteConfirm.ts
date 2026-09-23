"use client";

import { useCallback, useState } from "react";

interface UseDeleteConfirmOptions<TRow> {
  /** Kirim permintaan hapus ke API. Lempar error kalau gagal. */
  onDelete: (row: TRow) => Promise<void>;
  /** Hanya dipanggil kalau penghapusan berhasil — mis. `refresh()` tabel. */
  onSuccess?: () => void;
}

export interface UseDeleteConfirmReturn<TRow> {
  /** Baris yang sedang dikonfirmasi; `null` berarti dialog tertutup */
  target: TRow | null;
  /** true selama permintaan hapus berjalan — untuk spinner tombol */
  deleting: boolean;
  /** Pesan gagal dari backend, mis. 409 karena datanya masih dipakai */
  error: string | null;
  /** Buka dialog konfirmasi untuk satu baris; identitasnya stabil */
  ask: (row: TRow) => void;
  /** Tutup dialog tanpa menghapus */
  cancel: () => void;
  /** Jalankan penghapusannya */
  confirm: () => void;
  /** Tutup kotak pesan gagal */
  dismissError: () => void;
}

/**
 * Alur hapus satu baris: konfirmasi, status menghapus, lalu refresh tabel —
 * tapi hanya kalau backend benar-benar berhasil menghapusnya.
 *
 * Urutannya yang penting: `onSuccess` dipanggil setelah `await` selesai tanpa
 * error. Kalau backend menolak (mis. 409 karena datanya masih dipakai), tabel
 * tidak diambil ulang dan pesannya ditaruh di `error`, jadi barisnya tetap
 * terlihat apa adanya.
 *
 * `ask` sengaja beridentitas tetap karena biasanya diteruskan ke konfigurasi
 * kolom tabel yang dibungkus `useMemo`.
 *
 * @example
 * const hapus = useDeleteConfirm<Unit>({
 *   onDelete: (unit) => deleteUnit(unit.id),
 *   onSuccess: refresh,
 * });
 *
 * <UnitTable onDelete={hapus.ask} ... />
 *
 * {hapus.error && (
 *   <Alert tone="error" onDismiss={hapus.dismissError}>{hapus.error}</Alert>
 * )}
 *
 * <ConfirmDialog
 *   open={hapus.target !== null}
 *   title={`Hapus ${hapus.target?.nama}?`}
 *   confirmLabel="Hapus"
 *   variant="danger"
 *   loading={hapus.deleting}
 *   onConfirm={hapus.confirm}
 *   onCancel={hapus.cancel}
 * />
 */
export function useDeleteConfirm<TRow>({
  onDelete,
  onSuccess,
}: UseDeleteConfirmOptions<TRow>): UseDeleteConfirmReturn<TRow> {
  const [target, setTarget] = useState<TRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback((row: TRow) => {
    setError(null);
    setTarget(row);
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  const cancel = useCallback(() => {
    // permintaan yang sudah terlanjur dikirim tidak bisa ditarik kembali
    if (deleting) return;
    setTarget(null);
  }, [deleting]);

  const confirm = useCallback(() => {
    if (!target || deleting) return;

    setDeleting(true);
    setError(null);

    onDelete(target)
      .then(() => {
        // dialog baru ditutup dan tabel baru disegarkan setelah benar-benar berhasil
        setTarget(null);
        onSuccess?.();
      })
      .catch((caught: Error) => {
        setError(caught.message);
        setTarget(null);
      })
      .finally(() => setDeleting(false));
  }, [target, deleting, onDelete, onSuccess]);

  return { target, deleting, error, ask, cancel, confirm, dismissError };
}
