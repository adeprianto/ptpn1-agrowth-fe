"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { ApiError } from "@/lib/http-client";
import { createUnit, getUnit, updateUnit } from "../../api/unit";
import { getRegionals } from "../../api/regional";
import {
  getBusinessTypes,
  getOperationalCategories,
} from "../../api/masterData";
import type { MasterRef } from "@/types/api/master-data";
import type { UnitPayload } from "@/types/api/unit";
import { getJenisDisplay } from "./jenisUnit";

/** Nilai select selalu string; dikonversi ke number saat dikirim. */
interface OperationalRow {
  operational_category_id: string;
  business_type_id: string;
}

/** Key form = field StoreUnitRequest, supaya error 422 langsung cocok. */
interface FormValues {
  code: string;
  name: string;
  parent_id: string;
  operationals: OperationalRow[];
}

const emptyRow: OperationalRow = {
  operational_category_id: "",
  business_type_id: "",
};

const emptyForm: FormValues = {
  code: "",
  name: "",
  parent_id: "",
  operationals: [emptyRow],
};

type FieldErrors = Partial<Record<"code" | "name" | "parent_id", string>>;

interface Options {
  regional: { id: number; label: string }[];
  jenis: MasterRef[];
  komoditas: MasterRef[];
}

interface UnitFormProps {
  mode: "create" | "edit";
  /** Wajib untuk mode edit */
  unitId?: number;
}

export function UnitForm({ mode, unitId }: UnitFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(emptyForm);
  const [options, setOptions] = useState<Options>({
    regional: [],
    jenis: [],
    komoditas: [],
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");

  // opsi dropdown
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      getRegionals({ per_page: 100 }, signal),
      getOperationalCategories(signal),
      getBusinessTypes(signal),
    ])
      .then(([regionals, jenis, komoditas]) =>
        setOptions({
          regional: regionals.rows.map((r) => ({ id: r.id, label: r.name })),
          jenis,
          komoditas,
        }),
      )
      .catch((e: unknown) => {
        if (!signal.aborted) setFormError((e as Error).message);
      });

    return () => controller.abort();
  }, []);

  // data unit yang diedit
  useEffect(() => {
    if (mode !== "edit" || !unitId) return;

    const controller = new AbortController();
    getUnit(unitId, controller.signal)
      .then((unit) => {
        const operationals = unit.operasional.map((row) => ({
          operational_category_id: String(row.operational_category_id ?? ""),
          business_type_id: String(row.business_type_id ?? ""),
        }));

        setValues({
          code: unit.code,
          name: unit.name,
          parent_id: unit.regional ? String(unit.regional.id) : "",
          operationals: operationals.length > 0 ? operationals : [emptyRow],
        });
        setLoading(false);
      })
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setFormError(
          e instanceof ApiError && e.status === 404
            ? "Unit tidak ditemukan."
            : e.message,
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [mode, unitId]);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function setOperational(index: number, row: Partial<OperationalRow>) {
    setValues((prev) => ({
      ...prev,
      operationals: prev.operationals.map((r, i) =>
        i === index ? { ...r, ...row } : r,
      ),
    }));
  }

  function addOperational() {
    setValues((prev) => ({
      ...prev,
      operationals: [...prev.operationals, emptyRow],
    }));
  }

  function removeOperational(index: number) {
    setValues((prev) => ({
      ...prev,
      operationals: prev.operationals.filter((_, i) => i !== index),
    }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!values.code.trim()) next.code = "Kode Unit wajib diisi";
    if (!values.name.trim()) next.name = "Nama Unit wajib diisi";
    if (!values.parent_id) next.parent_id = "Regional wajib dipilih";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    // baris kosong diabaikan; unit boleh tidak punya data operasional
    const payload: UnitPayload = {
      code: values.code.trim(),
      name: values.name.trim(),
      parent_id: Number(values.parent_id),
      operationals: values.operationals
        .filter((row) => row.operational_category_id)
        .map((row) => ({
          operational_category_id: Number(row.operational_category_id),
          business_type_id: row.business_type_id
            ? Number(row.business_type_id)
            : null,
        })),
    };

    setSaving(true);
    setFormError(null);
    try {
      if (mode === "edit" && unitId) {
        await updateUnit(unitId, payload);
      } else {
        await createUnit(payload);
      }
      router.push("/organisasi/unit");
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        const fieldErrors: FieldErrors = {};
        const others: string[] = [];
        Object.entries(e.errors).forEach(([field, messages]) => {
          if (field === "code" || field === "name" || field === "parent_id") {
            fieldErrors[field] = messages[0];
          } else {
            others.push(messages[0]);
          }
        });
        setErrors(fieldErrors);
        setFormError(others[0] ?? (Object.keys(fieldErrors).length ? null : e.message));
      } else {
        setFormError((e as Error).message);
      }
      setSaving(false);
    }
  }

  const isEdit = mode === "edit";

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Unit", href: "/organisasi/unit" },
          { label: isEdit ? "Edit Unit" : "Tambah Unit" },
        ]}
      />

      <PageHeader
        title={isEdit ? "Edit Unit" : "Tambah Unit"}
        description="Satu unit bisa punya lebih dari satu pasangan jenis dan komoditas."
      />

      {formError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {formError}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
          Memuat data unit...
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-slate-300 bg-white p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Kode Unit" required error={errors.code}>
              <input
                type="text"
                value={values.code}
                onChange={(e) => setField("code", e.target.value)}
                placeholder="Cth. UNIT101"
                className={inputClass(!!errors.code)}
              />
            </Field>

            <Field label="Nama Unit" required error={errors.name}>
              <input
                type="text"
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Cth. Kebun Sei Rokan"
                className={inputClass(!!errors.name)}
              />
            </Field>
          </div>

          <Field label="Regional" required error={errors.parent_id}>
            <select
              value={values.parent_id}
              onChange={(e) => setField("parent_id", e.target.value)}
              className={inputClass(!!errors.parent_id)}
            >
              <option value="">Pilih Regional</option>
              {options.regional.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Jenis &amp; Komoditas
              </label>
              <button
                type="button"
                onClick={addOperational}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Baris
              </button>
            </div>

            <div className="space-y-2">
              {values.operationals.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={row.operational_category_id}
                    onChange={(e) =>
                      setOperational(index, {
                        operational_category_id: e.target.value,
                      })
                    }
                    className={`${inputClass(false)} flex-1`}
                  >
                    <option value="">Pilih Jenis</option>
                    {options.jenis.map((j) => (
                      <option key={j.id} value={j.id}>
                        {getJenisDisplay(j).label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={row.business_type_id}
                    onChange={(e) =>
                      setOperational(index, { business_type_id: e.target.value })
                    }
                    className={`${inputClass(false)} flex-1`}
                  >
                    <option value="">Tanpa Komoditas</option>
                    {options.komoditas.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name} ({k.code})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeOperational(index)}
                    disabled={values.operationals.length === 1}
                    aria-label="Hapus baris"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Baris yang jenisnya belum dipilih akan diabaikan. Pasangan jenis
              dan komoditas tidak boleh kembar.
            </p>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Link
              href="/organisasi/unit"
              className="rounded-xl bg-slate-400 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
            >
              Batal
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Unit"}
            </button>
          </div>
        </div>
      )}
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
