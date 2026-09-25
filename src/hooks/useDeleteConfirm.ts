"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui";

interface UseDeleteConfirmOptions<TRow> {
  /** Kirim permintaan hapus ke API. Lempar error kalau gagal. */
  onDelete: (row: TRow) => Promise<void>;
  /** Hanya dipanggil kalau penghapusan berhasil — mis. `refresh()` tabel. */
  onSuccess?: () => void;
  /**
   * Isi toast kalau berhasil. Dikosongkan untuk data dummy yang sebenarnya
   * tidak dihapus dari server.
   */
  successMessage?: (row: TRow) => string;
  /** Judul toast kalau gagal; alasannya dari backend ditaruh di bawahnya */
  errorMessage?: (row: TRow) => string;
}

export interface UseDeleteConfirmReturn<TRow> {
  /** Baris yang sedang dikonfirmasi; `null` berarti dialog tertutup */
  target: TRow | null;
  /** true selama permintaan hapus berjalan — untuk spinner tombol */
  deleting: boolean;
  /** Buka dialog konfirmasi untuk satu baris; identitasnya stabil */
  ask: (row: TRow) => void;
  /** Tutup dialog tanpa menghapus */
  cancel: () => void;
  /** Jalankan penghapusannya */
  confirm: () => void;
}

/**
 * Alur hapus satu baris: konfirmasi, status menghapus, lalu refresh tabel —
 * tapi hanya kalau backend benar-benar berhasil menghapusnya.
 *
 * Urutannya yang penting: `onSuccess` dipanggil setelah `await` selesai tanpa
 * error. Kalau backend menolak (mis. 409 karena datanya masih dipakai), tabel
 * tidak diambil ulang dan alasannya muncul sebagai toast gagal, jadi barisnya
 * tetap terlihat apa adanya.
 *
 * `ask` sengaja beridentitas tetap karena biasanya diteruskan ke konfigurasi
 * kolom tabel yang dibungkus `useMemo`.
 *
 * @example
 * const hapus = useDeleteConfirm<Unit>({
 *   onDelete: (unit) => deleteUnit(unit.id),
 *   onSuccess: refresh,
 *   successMessage: (unit) => `Unit "${unit.nama}" berhasil dihapus`,
 * });
 *
 * <UnitTable onDelete={hapus.ask} ... />
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
  successMessage,
  errorMessage,
}: UseDeleteConfirmOptions<TRow>): UseDeleteConfirmReturn<TRow> {
  const toast = useToast();
  const [target, setTarget] = useState<TRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const ask = useCallback((row: TRow) => setTarget(row), []);

  const cancel = useCallback(() => {
    // permintaan yang sudah terlanjur dikirim tidak bisa ditarik kembali
    if (deleting) return;
    setTarget(null);
  }, [deleting]);

  const confirm = useCallback(() => {
    if (!target || deleting) return;

    const row = target;
    setDeleting(true);

    onDelete(row)
      .then(() => {
        // dialog baru ditutup dan tabel baru disegarkan setelah benar-benar berhasil
        setTarget(null);
        onSuccess?.();
        if (successMessage) toast.success(successMessage(row));
      })
      .catch((caught: Error) => {
        setTarget(null);
        toast.error(errorMessage?.(row) ?? "Data gagal dihapus", caught.message);
      })
      .finally(() => setDeleting(false));
  }, [target, deleting, onDelete, onSuccess, successMessage, errorMessage, toast]);

  return { target, deleting, ask, cancel, confirm };
}
