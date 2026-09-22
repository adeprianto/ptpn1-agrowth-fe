"use client";

import { useState } from "react";
import { Button, Modal, ModalActions, SearchInput } from "@/components/ui";
import { FilterChecklist } from "./FilterChecklist";
import type { ColumnFilterConfig } from "./dataTableFeatures";

/**
 * Nilai filter satu kolom.
 * - `string`  -> filter teks, baris lolos kalau nilainya mengandung teks ini
 * - `string[]` -> filter checklist, baris lolos kalau nilainya ada di daftar
 */
export type ColumnFilterValue = string | string[];

/** true kalau nilainya benar-benar menyaring sesuatu. */
export function isFilterFilled(value: ColumnFilterValue | undefined): boolean {
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
}

export interface ColumnFilterModalProps {
  open: boolean;
  /** Judul kolom yang sedang difilter, mis. "Nama Pegawai" */
  label: string;
  /** Bentuk filternya: kotak cari teks, atau checklist nilai */
  config: ColumnFilterConfig;
  /** Filter yang sedang berlaku untuk kolom ini; kosongkan kalau belum ada */
  value?: ColumnFilterValue;
  /** Dipanggil saat Terapkan. `undefined` berarti filter kolom ini dihapus. */
  onApply: (value: ColumnFilterValue | undefined) => void;
  onClose: () => void;
}

/**
 * Modal filter untuk SATU kolom.
 *
 * Perubahan ditampung sebagai draft dan baru berlaku saat "Terapkan", jadi
 * data hanya diambil ulang sekali. Isinya selalu mulai dari filter yang
 * sedang berlaku karena modal ini baru dirender ketika `open` bernilai true.
 *
 * Bisa dipakai lepas dari `DataTable` — cukup pegang nilainya sendiri:
 *
 * @example Filter teks
 * const [nama, setNama] = useState<string>();
 *
 * <ColumnFilterModal
 *   open={open}
 *   label="Nama Pegawai"
 *   config={{ type: "text", placeholder: "Cari nama..." }}
 *   value={nama}
 *   onApply={(next) => setNama(next as string | undefined)}
 *   onClose={() => setOpen(false)}
 * />
 *
 * @example Filter checklist
 * <ColumnFilterModal
 *   open={open}
 *   label="Level"
 *   config={{ type: "options", options: [{ value: "1", label: "BOD-1" }] }}
 *   value={level}
 *   onApply={(next) => setLevel(next as string[] | undefined)}
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
  const [draft, setDraft] = useState<ColumnFilterValue>(
    () => value ?? (config.type === "options" ? [] : ""),
  );

  const filled = isFilterFilled(draft);

  function apply() {
    if (!filled) {
      // filter kosong = kolom ini tidak lagi menyaring apa pun
      onApply(undefined);
    } else {
      onApply(typeof draft === "string" ? draft.trim() : draft);
    }

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
      description={
        config.type === "text"
          ? "Baris ditampilkan kalau isinya mengandung teks yang dicari."
          : "Centang nilai yang ingin ditampilkan."
      }
      footer={
        <ModalActions
          secondary={
            <Button
              variant="ghost"
              disabled={!isFilterFilled(value)}
              onClick={clear}
            >
              Hapus filter
            </Button>
          }
        >
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={apply}>Terapkan</Button>
        </ModalActions>
      }
    >
      {config.type === "text" ? (
        <SearchInput
          autoFocus
          value={typeof draft === "string" ? draft : ""}
          placeholder={config.placeholder ?? "Cari..."}
          onValueChange={setDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") apply();
          }}
        />
      ) : (
        <FilterChecklist
          autoFocus
          options={config.options}
          selected={Array.isArray(draft) ? draft : []}
          onChange={setDraft}
          listClassName="max-h-80"
        />
      )}
    </Modal>
  );
}
