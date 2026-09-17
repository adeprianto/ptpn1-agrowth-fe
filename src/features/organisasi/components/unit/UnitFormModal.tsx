"use client";

import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export interface DropdownOption {
  id: string;
  label: string;
}

export interface UnitFormValues {
  kode: string;
  name: string;
  regionalId: string;
  kategoriId: string;
  komoditasId: string;
}

const emptyForm: UnitFormValues = {
  kode: "",
  name: "",
  regionalId: "",
  kategoriId: "",
  komoditasId: "",
};

type FormErrors = Partial<Record<keyof UnitFormValues, string>>;

interface UnitFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: UnitFormValues;
  regionalOptions: DropdownOption[];
  kategoriOptions: DropdownOption[];
  komoditasOptions: DropdownOption[];
  onClose: () => void;
  onSubmit: (values: UnitFormValues) => void;
}

export function UnitFormModal({
  open,
  mode,
  initialValues,
  regionalOptions,
  kategoriOptions,
  komoditasOptions,
  onClose,
  onSubmit,
}: UnitFormModalProps) {
  const [values, setValues] = useState<UnitFormValues>(
    initialValues ?? emptyForm,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? emptyForm);
      setErrors({});
    }
  }, [open, initialValues]);

  if (!open) return null;

  function handleChange<K extends keyof UnitFormValues>(
    key: K,
    value: UnitFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!values.kode.trim()) nextErrors.kode = "Kode Unit wajib diisi";
    if (!values.name.trim()) nextErrors.name = "Nama Unit wajib diisi";
    if (!values.regionalId) nextErrors.regionalId = "Regional wajib dipilih";
    if (!values.kategoriId) nextErrors.kategoriId = "Kategori wajib dipilih";
    if (!values.komoditasId) nextErrors.komoditasId = "Komoditas wajib dipilih";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {mode === "create" ? "Tambah Unit" : "Edit Unit"}
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

        <div className="space-y-4">
          <Field label="Kode Unit" required error={errors.kode}>
            <input
              type="text"
              value={values.kode}
              onChange={(e) => handleChange("kode", e.target.value)}
              placeholder="Cth. UNT-001"
              className={inputClass(!!errors.kode)}
            />
          </Field>

          <Field label="Nama Unit" required error={errors.name}>
            <input
              type="text"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Cth. Kebun Sei Rokan"
              className={inputClass(!!errors.name)}
            />
          </Field>

          <Field label="Regional" required error={errors.regionalId}>
            <select
              value={values.regionalId}
              onChange={(e) => handleChange("regionalId", e.target.value)}
              className={inputClass(!!errors.regionalId)}
            >
              <option value="">Pilih Regional</option>
              {regionalOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          {/* Kategori & Komoditas disandingkan dalam 1 baris, 2 kolom */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori" required error={errors.kategoriId}>
              <select
                value={values.kategoriId}
                onChange={(e) => handleChange("kategoriId", e.target.value)}
                className={inputClass(!!errors.kategoriId)}
              >
                <option value="">Pilih Kategori</option>
                {kategoriOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Komoditas" required error={errors.komoditasId}>
              <select
                value={values.komoditasId}
                onChange={(e) => handleChange("komoditasId", e.target.value)}
                className={inputClass(!!errors.komoditasId)}
              >
                <option value="">Pilih Komoditas</option>
                {komoditasOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-400 px-4 py-2 text-sm font-medium text-white hover:bg-slate-500"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            {mode === "create" ? "Simpan Unit" : "Simpan Perubahan"}
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
