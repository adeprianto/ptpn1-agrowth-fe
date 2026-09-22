"use client";

import { useState } from "react";
import { Button, Modal, ModalActions } from "@/components/ui";
import { FilterChecklist } from "./FilterChecklist";
import type { ColumnFilterConfig } from "./dataTableFeatures";

export interface ColumnFilterModalProps {
  open: boolean;
  /** Judul kolom yang sedang difilter, mis. "Level" */
  label: string;
  /** Daftar pilihan yang bisa dicentang */
  config: ColumnFilterConfig;
  /** Nilai yang sedang tercentang; kosongkan kalau belum ada filter */
  value?: string[];
  /** Dipanggil saat Terapkan. `undefined` berarti filter kolom ini dihapus. */
  onApply: (values: string[] | undefined) => void;
  onClose: () => void;
}

/**
 * Modal daftar centang untuk SATU kolom, dibuka lewat ikon corong di judul
 * kolomnya. Di dalamnya ada kotak cari untuk menyaring daftar pilihan —
 * berguna saat pilihannya ratusan (mis. daftar unit).
 *
 * Perubahan ditampung sebagai draft dan baru berlaku saat "Terapkan", jadi
 * data hanya diambil ulang sekali. Isinya selalu mulai dari filter yang
 * sedang berlaku karena modal ini baru dirender ketika `open` bernilai true.
 *
 * Tidak bergantung pada `DataTable`, jadi bisa dipakai lepas:
 *
 * @example
 * const [level, setLevel] = useState<string[]>();
 *
 * <ColumnFilterModal
 *   open={open}
 *   label="Level"
 *   config={{ options: [{ value: "1", label: "BOD-1" }] }}
 *   value={level}
 *   onApply={setLevel}
 *   onClose={() => setOpen(false)}
 * />
 */
export function ColumnFilterModal({ open, ...props }: ColumnFilterModalProps) {
  // Dirender hanya saat terbuka supaya draft di dalamnya selalu segar —
  // tidak perlu efek apa pun untuk menyamakan draft dengan `value`.
  if (!open) return null;

  return <OpenColumnFilterModal {...props} />;
}

function OpenColumnFilterModal({
  label,
  config,
  value,
  onApply,
  onClose,
}: Omit<ColumnFilterModalProps, "open">) {
  const [draft, setDraft] = useState<string[]>(() => value ?? []);

  function apply() {
    // tidak ada yang dicentang = kolom ini tidak lagi menyaring apa pun
    onApply(draft.length > 0 ? draft : undefined);
    onClose();
  }

  function clear() {
    onApply(undefined);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="md"
      title={`Filter ${label}`}
      description="Centang nilai yang ingin ditampilkan."
      footer={
        <ModalActions
          secondary={
            <Button variant="ghost" disabled={!value?.length} onClick={clear}>
              Hapus filter
            </Button>
          }
        >
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={apply}>
            Terapkan{draft.length > 0 ? ` (${draft.length})` : ""}
          </Button>
        </ModalActions>
      }
    >
      <FilterChecklist
        autoFocus
        options={config.options}
        selected={draft}
        onChange={setDraft}
        listClassName="max-h-80"
      />
    </Modal>
  );
}
