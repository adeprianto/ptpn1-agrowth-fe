"use client";

import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { cn } from "cn";
import { controlClasses } from "./Field";

export type InputProps = Omit<ComponentProps<"input">, "className"> & {
  invalid?: boolean;
  className?: string;
};

/** Kotak isian teks standar. Pasangkan dengan `Field` untuk label & error. */
export function Input({ invalid, className, type = "text", ...rest }: InputProps) {
  return (
    <input
      {...rest}
      type={type}
      aria-invalid={invalid || undefined}
      className={controlClasses(invalid, className)}
    />
  );
}

interface SearchInputProps extends Omit<InputProps, "onChange" | "value" | "type"> {
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * Kotak pencarian dengan ikon kaca pembesar.
 *
 * @example
 * <SearchInput value={search} onValueChange={setSearch} placeholder="Cari unit..." />
 */
export function SearchInput({
  value,
  onValueChange,
  className,
  placeholder = "Cari...",
  ...rest
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        {...rest}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn("pl-9", className)}
      />
    </div>
  );
}
