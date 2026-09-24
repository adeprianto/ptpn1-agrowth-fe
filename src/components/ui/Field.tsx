import type { ReactNode } from "react";
import { cn } from "cn";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  /** Id input yang dibungkus, supaya label-nya bisa diklik */
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Pembungkus satu isian form: label, kontrol, lalu hint atau pesan error.
 * Kontrolnya bebas — `Input`, `Select`, `Textarea`, atau komponen lain.
 *
 * @example
 * <Field label="Nama Unit" required error={errors.name}>
 *   <Input value={name} onChange={...} invalid={Boolean(errors.name)} />
 * </Field>
 */
export function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
  className,
}: FieldProps) {
  return (
    // `data-field-error` dipakai useFormSubmit untuk menggulir ke isian yang salah
    <div className={className} data-field-error={error ? true : undefined}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

/** Kelas dasar semua kontrol form — dipakai Input, Select, dan Textarea. */
export const controlClass = cn(
  // ukuran
  "w-full",
  // tampilan
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5",
  // teks
  "text-sm text-slate-700 placeholder:text-slate-400",
  // interaksi
  "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
);

export const invalidControlClass = cn(
  // tampilan
  "border-rose-400",
  // interaksi
  "focus:border-rose-500 focus:ring-rose-500/20",
);

export function controlClasses(invalid?: boolean, className?: string) {
  return cn(controlClass, invalid && invalidControlClass, className);
}
