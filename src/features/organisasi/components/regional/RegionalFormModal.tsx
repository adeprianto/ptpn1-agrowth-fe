"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { ApiError } from "@/lib/http-client";

/** Key-nya sama dengan field StoreRegionalRequest supaya error 422 langsung cocok. */
export interface RegionalFormValues {
  name: string;
  code: string;
}

const emptyForm: RegionalFormValues = {
  name: "",
  code: "",
};

type FormErrors = Partial<Record<keyof RegionalFormValues, string>>;

interface RegionalFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: RegionalFormValues;
  onClose: () => void;
  /** Lempar error (mis. ApiError 422) untuk menampilkan pesannya di form */
  onSubmit: (values: RegionalFormValues) => Promise<void>;
}

export function RegionalFormModal({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: RegionalFormModalProps) {
  const [values, setValues] = useState<RegionalFormValues>(
    initialValues ?? emptyForm,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  function handleChange<K extends keyof RegionalFormValues>(
    key: K,
    value: RegionalFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = "Nama Regional wajib diisi";
    if (!values.code.trim()) nextErrors.code = "Kode Regional wajib diisi";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSaving(true);
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      // error validasi dari backend dipetakan ke field-nya masing-masing
      if (e instanceof ApiError && e.errors) {
        const fieldErrors: FormErrors = {};
        Object.entries(e.errors).forEach(([field, messages]) => {
          if (field in emptyForm) {
            fieldErrors[field as keyof RegionalFormValues] = messages[0];
          }
        });
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0) setFormError(e.message);
      } else {
        setFormError((e as Error).message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {mode === "create" ? "Tambah Regional" : "Edit Regional"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {formError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {formError}
          </div>
        )}

        <div className="space-y-4">
          <Field label="Nama Regional" required error={errors.name}>
            <input
              type="text"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Cth. Regional 1"
              className={inputClass(!!errors.name)}
            />
          </Field>

          <Field label="Kode Regional" required error={errors.code}>
            <input
              type="text"
              value={values.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="REG01"
              className={inputClass(!!errors.code)}
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-400 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {saving
              ? "Menyimpan..."
              : mode === "create"
                ? "Simpan Regional"
                : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-rose-300 focus:ring-rose-500/20"
      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
  }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
