"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

export interface RegionalFormValues {
  nama: string;
  kode: string;
  wilayah: string;
}

const emptyForm: RegionalFormValues = {
  nama: "",
  kode: "",
  wilayah: "",
};

type FormErrors = Partial<Record<keyof RegionalFormValues, string>>;

interface RegionalFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: RegionalFormValues;
  onClose: () => void;
  onSubmit: (values: RegionalFormValues) => void;
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

  if (!open) return null;

  function handleChange<K extends keyof RegionalFormValues>(
    key: K,
    value: RegionalFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!values.nama.trim()) nextErrors.nama = "Nama Regional wajib diisi";
    if (!values.kode.trim()) nextErrors.kode = "Kode Regional wajib diisi";
    if (!values.wilayah.trim())
      nextErrors.wilayah = "Wilayah/Provinsi wajib diisi";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h- w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
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

        <div className="space-y-4">
          <Field label="Nama Regional" required error={errors.nama}>
            <input
              type="text"
              value={values.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              placeholder="Cth. Regional 1"
              className={inputClass(!!errors.nama)}
            />
          </Field>

          <Field label="Kode Regional" required error={errors.kode}>
            <input
              type="text"
              value={values.kode}
              onChange={(e) => handleChange("kode", e.target.value)}
              placeholder="REG-01"
              className={inputClass(!!errors.kode)}
            />
          </Field>

          <Field label="Wilayah/Provinsi" required error={errors.wilayah}>
            <input
              type="text"
              value={values.wilayah}
              onChange={(e) => handleChange("wilayah", e.target.value)}
              placeholder="Cth. Medan"
              className={inputClass(!!errors.wilayah)}
            />
          </Field>

          {/* <Field label="Nomor Telpon Kantor">
            <input
              type="text"
              value={values.noTelepon}
              onChange={(e) => handleChange("noTelepon", e.target.value)}
              placeholder="(+123) xxx xxx"
              className={inputClass(false)}
            />
          </Field> */}

          {/* <Field label="Alamat Kantor">
            <textarea
              value={values.alamat}
              onChange={(e) => handleChange("alamat", e.target.value)}
              placeholder="Alamat lengkap kantor regional"
              rows={3}
              className={inputClass(false)}
            />
          </Field> */}
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
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            {mode === "create" ? "Simpan Regional" : "Simpan Perubahan"}
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
