"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/http-client";

export type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

/**
 * Gulir ke isian pertama yang sedang menampilkan pesan error, lalu taruh
 * kursor di kontrolnya. Isian ditandai oleh komponen `Field` lewat atribut
 * `data-field-error`, jadi semua jenis kontrol ikut tercakup.
 */
function scrollToFirstError() {
  const field = document.querySelector("[data-field-error]");
  if (!field) return;

  field.scrollIntoView({ behavior: "smooth", block: "center" });
  field
    .querySelector<HTMLElement>("input, select, textarea")
    ?.focus({ preventScroll: true });
}

interface UseFormSubmitOptions<TValues> {
  /** Validasi di browser sebelum request dikirim */
  validate?: (values: TValues) => FieldErrors<TValues>;
  /** Lempar `ApiError` dari sini; error 422 otomatis dipetakan ke field */
  onSubmit: (values: TValues) => Promise<void>;
  /**
   * Terjemahan nama field backend ke key form, untuk field yang namanya beda.
   * Contoh: `{ parent_id: "regionalId" }`.
   */
  fieldMap?: Record<string, keyof TValues>;
}

export interface UseFormSubmitReturn<TValues> {
  submit: (values: TValues) => Promise<void>;
  saving: boolean;
  /** Pesan error per field — dari validasi lokal maupun respons 422 backend */
  errors: FieldErrors<TValues>;
  /** Error yang tidak menempel ke field mana pun, mis. 409 atau 500 */
  formError: string | null;
  setErrors: (errors: FieldErrors<TValues>) => void;
  clearErrors: () => void;
}

/**
 * Alur simpan satu form: validasi lokal, status menyimpan, lalu memetakan
 * error validasi backend (422) ke field-nya masing-masing.
 *
 * @example
 * const { submit, saving, errors, formError } = useFormSubmit<RegionalFormValues>({
 *   validate: (v) => ({
 *     nama: v.nama.trim() ? undefined : "Nama Regional wajib diisi",
 *   }),
 *   fieldMap: { name: "nama", code: "kode" },
 *   onSubmit: (v) => simpanRegional(v),
 * });
 */
export function useFormSubmit<TValues extends object>({
  validate,
  onSubmit,
  fieldMap,
}: UseFormSubmitOptions<TValues>): UseFormSubmitReturn<TValues> {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<TValues>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Tombol simpan biasanya di bawah, sedangkan isian yang salah bisa jauh di
  // atas. Setiap kali ada error baru (dari validasi lokal maupun 422 backend),
  // tampilan digulir ke isian pertama yang salah.
  useEffect(() => {
    if (Object.keys(errors).length > 0) scrollToFirstError();
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setFormError(null);
  }, []);

  const submit = useCallback(
    async (values: TValues) => {
      // buang key bernilai undefined supaya field yang lolos tidak ikut tercatat
      const localErrors = Object.fromEntries(
        Object.entries(validate?.(values) ?? {}).filter(([, message]) => message),
      ) as FieldErrors<TValues>;

      if (Object.keys(localErrors).length > 0) {
        setErrors(localErrors);
        setFormError(null);
        return;
      }

      setSaving(true);
      setErrors({});
      setFormError(null);

      try {
        await onSubmit(values);
      } catch (caught) {
        if (caught instanceof ApiError && caught.errors) {
          const fieldErrors: FieldErrors<TValues> = {};

          for (const [field, messages] of Object.entries(caught.errors)) {
            const key = fieldMap?.[field] ?? (field as keyof TValues);
            if (key in values) fieldErrors[key] = messages[0];
          }

          setErrors(fieldErrors);
          // 422 yang tidak cocok ke field mana pun tetap perlu terlihat
          if (Object.keys(fieldErrors).length === 0) setFormError(caught.message);
        } else {
          setFormError((caught as Error).message);
        }
      } finally {
        setSaving(false);
      }
    },
    [validate, onSubmit, fieldMap],
  );

  return { submit, saving, errors, formError, setErrors, clearErrors };
}
