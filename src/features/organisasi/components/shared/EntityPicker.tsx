"use client";

import { Select } from "@/components/ui";
import {
  ENTITY_TIPE_LABEL,
  type EntityOption,
  type EntityTipe,
} from "../../model/entity";

const GROUP_ORDER: EntityTipe[] = ["HO", "Regional", "Unit"];

interface EntityPickerProps {
  /** null selama opsi masih dimuat */
  options: EntityOption[] | null;
  value: string;
  onChange: (entityId: string) => void;
  /** Baris pertama untuk "belum memilih"; kosongkan kalau wajib pilih */
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Dropdown pemilih entity, dikelompokkan jadi Head Office / Regional / Unit.
 * Dipakai di form departemen dan di halaman struktur departemen.
 */
export function EntityPicker({
  options,
  value,
  onChange,
  placeholder,
  invalid,
  disabled,
  className,
}: EntityPickerProps) {
  if (!options) {
    return (
      <Select className={className} value="" disabled onChange={() => {}}>
        <option value="">Memuat entity...</option>
      </Select>
    );
  }

  return (
    <Select
      className={className}
      value={value}
      invalid={invalid}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    >
      {GROUP_ORDER.map((tipe) => {
        const group = options.filter((option) => option.tipe === tipe);
        if (group.length === 0) return null;

        return (
          <optgroup key={tipe} label={ENTITY_TIPE_LABEL[tipe]}>
            {group.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nama}
              </option>
            ))}
          </optgroup>
        );
      })}
    </Select>
  );
}
