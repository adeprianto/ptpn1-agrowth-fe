"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";
import { controlClasses } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectProps = Omit<ComponentProps<"select">, "className" | "children"> & {
  invalid?: boolean;
  className?: string;
  /** Daftar opsi; kalau diisi, tidak perlu menulis <option> sendiri */
  options?: SelectOption[];
  /** Opsi pertama yang tampil saat nilainya masih kosong */
  placeholder?: string;
  children?: ReactNode;
};

/**
 * Dropdown pilihan tunggal.
 *
 * @example
 * <Select
 *   value={regionalId}
 *   onChange={(e) => setRegionalId(e.target.value)}
 *   placeholder="Pilih regional"
 *   options={regionals.map((r) => ({ value: r.id, label: r.nama }))}
 * />
 */
export function Select({
  invalid,
  className,
  options,
  placeholder,
  children,
  ...rest
}: SelectProps) {
  return (
    <select
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(controlClasses(invalid, className), "pr-8")}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options?.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
      {children}
    </select>
  );
}
