"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { ApiError } from "@/lib/api-client";
import {
  createUnit,
  getUnit,
  updateUnit,
  type UnitPayload,
} from "../../api/unit";
import { getRegionals } from "../../api/regional";
import {
  getBusinessTypes,
  getOperationalCategories,
  type MasterRef,
} from "../../api/masterData";
import { getJenisDisplay } from "./jenisUnit";

interface OperasionalRow {
  jenisId: string;
  komoditasId: string;
}

interface FormValues {
  kode: string;
  nama: string;
  regionalId: string;
  operasional: OperasionalRow[];
}

const emptyForm: FormValues = {
  kode: "",
  nama: "",
  regionalId: "",
  operasional: [{ jenisId: "", komoditasId: "" }],
};

type FieldErrors = Partial<Record<"kode" | "nama" | "regionalId", string>>;

// nama field backend -> field form
const FIELD_MAP: Record<string, keyof FieldErrors> = {
  code: "kode",
  name: "nama",
  parent_id: "regionalId",
};

interface Options {
  regional: { id: string; label: string }[];
  jenis: MasterRef[];
  komoditas: MasterRef[];
}

interface UnitFormProps {
  mode: "create" | "edit";
  /** Wajib untuk mode edit */
  unitId?: string;
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
      getRegionals({ perPage: 100 }, signal),
      getOperationalCategories(signal),
      getBusinessTypes(signal),
    ])
      .then(([regionals, jenis, komoditas]) =>
        setOptions({
          regional: regionals.rows.map((r) => ({ id: r.id, label: r.nama })),
          jenis,
          komoditas,
        }),
      )
      .catch((e) => {
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
        setValues({
          kode: unit.kode,
          nama: unit.nama,
          regionalId: unit.regionalId ?? "",
          operasional:
            unit.operasional.length > 0
              ? unit.operasional
              : [{ jenisId: "", komoditasId: "" }],
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

  function setOperasional(index: number, row: Partial<OperasionalRow>) {
    setValues((prev) => ({
      ...prev,
      operasional: prev.operasional.map((r, i) =>
        i === index ? { ...r, ...row } : r,
      ),
    }));
  }

  function addOperasional() {
    setValues((prev) => ({
      ...prev,
      operasional: [...prev.operasional, { jenisId: "", komoditasId: "" }],
    }));
  }

  function removeOperasional(index: number) {
    setValues((prev) => ({
      ...prev,
      operasional: prev.operasional.filter((_, i) => i !== index),
    }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!values.kode.trim()) next.kode = "Kode Unit wajib diisi";
    if (!values.nama.trim()) next.nama = "Nama Unit wajib diisi";
    if (!values.regionalId) next.regionalId = "Regional wajib dipilih";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    // baris kosong diabaikan; unit boleh tidak punya data operasional
    const payload: UnitPayload = {
      code: values.kode.trim(),
      name: values.nama.trim(),
      parent_id: values.regionalId,
      operationals: values.operasional
        .filter((row) => row.jenisId)
        .map((row) => ({
          operational_category_id: Number(row.jenisId),
          business_type_id: row.komoditasId ? Number(row.komoditasId) : null,
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
          const key = FIELD_MAP[field];
          if (key) fieldErrors[key] = messages[0];
          else others.push(messages[0]);
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
            <Field label="Kode Unit" required error={errors.kode}>
              <input
                type="text"
                value={values.kode}
                onChange={(e) => setField("kode", e.target.value)}
                placeholder="Cth. UNIT101"
                className={inputClass(!!errors.kode)}
              />
            </Field>

            <Field label="Nama Unit" required error={errors.nama}>
              <input
                type="text"
                value={values.nama}
                onChange={(e) => setField("nama", e.target.value)}
                placeholder="Cth. Kebun Sei Rokan"
                className={inputClass(!!errors.nama)}
              />
            </Field>
          </div>

          <Field label="Regional" required error={errors.regionalId}>
            <select
              value={values.regionalId}
              onChange={(e) => setField("regionalId", e.target.value)}
              className={inputClass(!!errors.regionalId)}
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
                onClick={addOperasional}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Baris
              </button>
            </div>

            <div className="space-y-2">
              {values.operasional.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={row.jenisId}
                    onChange={(e) =>
                      setOperasional(index, { jenisId: e.target.value })
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
                    value={row.komoditasId}
                    onChange={(e) =>
                      setOperasional(index, { komoditasId: e.target.value })
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
                    onClick={() => removeOperasional(index)}
                    disabled={values.operasional.length === 1}
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
