"use client";

import type { ComponentProps } from "react";
import { controlClasses } from "./Field";

export type TextareaProps = Omit<ComponentProps<"textarea">, "className"> & {
  invalid?: boolean;
  className?: string;
};

/** Isian teks panjang. Pasangkan dengan `Field` untuk label & error. */
export function Textarea({ invalid, className, rows = 3, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={controlClasses(invalid, className)}
    />
  );
}
