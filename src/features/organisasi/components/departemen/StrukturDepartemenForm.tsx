"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormField, formInputClass } from "@/components/shared/FormField";
import { ApiError } from "@/lib/api-client";
import {
  createDepartemen,
  getDepartemen,
  getDepartemenOptions,
  updateDepartemen,
  type DepartemenPayload,
} from "../../api/departemen";
import {
  getJobFunctions,
  getOrganizationTypes,
  type MasterRef,
} from "../../api/masterData";
import {
  getEntityOptions,
  type EntityOption,
  type EntityTier,
} from "../../api/entityOptions";

interface FormValues {
  kode: string;
  nama: string;
  level: string;
  tipeId: string;
  entityId: string;
  jobFunctionId: string;
  parentId: string;
}

const emptyValues: FormValues = {
  kode: "",
  nama: "",
  level: "1",
  tipeId: "",
  entityId: "",
  jobFunctionId: "",
  parentId: "",
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

// nama field backend -> field form
const FIELD_MAP: Record<string, keyof FormValues> = {
  code: "kode",
  name: "nama",
  level: "level",
  organization_type_id: "tipeId",
  entity_id: "entityId",
  job_function_id: "jobFunctionId",
  parent_id: "parentId",
};

const TIER_LABEL: Record<EntityTier, string> = {
  HO: "Head Office",
  Regional: "Regional",
  Unit: "Unit",
};

interface StrukturDepartemenFormProps {
  mode: "create" | "edit";
  /** Dipakai saat mode "create" buat prefill Entity dari halaman List */
  defaultEntityId?: string;
  /** Wajib untuk mode edit */
  departemenId?: string;
}

export function StrukturDepartemenForm({
  mode,
  defaultEntityId,
  departemenId,
}: StrukturDepartemenFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState<FormValues>({
    ...emptyValues,
    entityId: defaultEntityId ?? "",
  });
  const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
  const [tipeOptions, setTipeOptions] = useState<MasterRef[]>([]);
  const [functionOptions, setFunctionOptions] = useState<MasterRef[]>([]);
  const [parentOptions, setParentOptions] = useState<
    { id: string; nama: string; kode: string }[]
  >([]);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  // opsi dropdown yang tidak tergantung entity
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      getEntityOptions(signal),
      getOrganizationTypes(signal),
      getJobFunctions(signal),
    ])
      .then(([entities, tipe, functions]) => {
        setEntityOptions(entities);
        setTipeOptions(tipe);
        setFunctionOptions(functions);
        // create tanpa prefill: pakai entity pertama
        setValues((prev) =>
          prev.entityId || entities.length === 0
            ? prev
            : { ...prev, entityId: entities[0].id },
        );
      })
      .catch((e) => {
        if (!signal.aborted) setFormError((e as Error).message);
      });

    return () => controller.abort();
  }, []);

  // data departemen yang diedit
  useEffect(() => {
    if (!isEdit || !departemenId) return;

    const controller = new AbortController();
    getDepartemen(departemenId, controller.signal)
      .then((d) => {
        setValues({
          kode: d.kode,
          nama: d.nama,
          level: String(d.level),
          tipeId: d.tipeId,
          entityId: d.entityId,
          jobFunctionId: d.jobFunctionId,
          parentId: d.parentId,
        });
        setLoading(false);
      })
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setFormError(
          e instanceof ApiError && e.status === 404
            ? "Departemen tidak ditemukan."
            : e.message,
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [isEdit, departemenId]);

  // Induk HARUS dari entity yang sama, jadi daftarnya ikut entity terpilih
  useEffect(() => {
    if (!values.entityId) return;

    const controller = new AbortController();
    getDepartemenOptions(values.entityId, controller.signal)
      .then(setParentOptions)
      .catch((e) => {
        if (!controller.signal.aborted) console.error(e);
      });

    return () => controller.abort();
  }, [values.entityId]);

  function handleChange<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
      // pindah entity = induk lama tidak valid lagi
      ...(key === "entityId" ? { parentId: "" } : {}),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload: DepartemenPayload = {
      code: values.kode.trim(),
      name: values.nama.trim(),
      level: Number(values.level),
      organization_type_id: Number(values.tipeId),
      entity_id: Number(values.entityId),
      job_function_id: values.jobFunctionId ? Number(values.jobFunctionId) : null,
      parent_id: values.parentId ? Number(values.parentId) : null,
    };

    setSaving(true);
    setErrors({});
    setFormError(null);

    try {
      if (isEdit && departemenId) {
        await updateDepartemen(departemenId, payload);
      } else {
        await createDepartemen(payload);
      }
      router.push("/organisasi/departemen");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const fieldErrors: FieldErrors = {};
        Object.entries(err.errors).forEach(([field, messages]) => {
          const key = FIELD_MAP[field];
          if (key) fieldErrors[key] = messages[0];
        });
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0) setFormError(err.message);
      } else {
        setFormError((err as Error).message);
      }
      setSaving(false);
    }
  }

  const tiers: EntityTier[] = ["HO", "Regional", "Unit"];

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Struktur Departemen", href: "/organisasi/departemen" },
          { label: isEdit ? "Edit Departemen" : "Tambah Departemen" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Link
          href="/organisasi/departemen"
          aria-label="Kembali ke daftar departemen"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Departemen" : "Tambah Departemen"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Susunan departemen di dalam satu entity (Head Office, Regional, atau
            Unit)
          </p>
        </div>
      </div>

      {formError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {formError}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
          Memuat data departemen...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <FormField label="Entity" required error={errors.entityId}>
            <select
              required
              value={values.entityId}
              onChange={(e) => handleChange("entityId", e.target.value)}
              className={formInputClass}
            >
              <option value="" disabled>
                Pilih...
              </option>
              {tiers.map((tier) => {
                const options = entityOptions.filter((e) => e.tier === tier);
                if (options.length === 0) return null;

                return (
                  <optgroup key={tier} label={TIER_LABEL[tier]}>
                    {options.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nama}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Kode" required error={errors.kode}>
              <input
                type="text"
                required
                value={values.kode}
                onChange={(e) => handleChange("kode", e.target.value)}
                placeholder="Cth. HO-SDM-REK"
                className={formInputClass}
              />
            </FormField>

            <FormField label="Nama Departemen" required error={errors.nama}>
              <input
                type="text"
                required
                value={values.nama}
                onChange={(e) => handleChange("nama", e.target.value)}
                placeholder="Cth. Bagian Rekrutmen"
                className={formInputClass}
              />
            </FormField>

            <FormField label="Tipe" required error={errors.tipeId}>
              <select
                required
                value={values.tipeId}
                onChange={(e) => handleChange("tipeId", e.target.value)}
                className={formInputClass}
              >
                <option value="" disabled>
                  Pilih...
                </option>
                {tipeOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Level"
              required
              error={errors.level}
              hint="1 = paling atas (mis. Direktorat), makin besar makin dalam"
            >
              <input
                type="number"
                min={1}
                max={5}
                required
                value={values.level}
                onChange={(e) => handleChange("level", e.target.value)}
                className={formInputClass}
              />
            </FormField>
          </div>

          <FormField
            label="Job Function"
            error={errors.jobFunctionId}
            hint={
              functionOptions.length === 0
                ? "Master Job Function masih kosong, jadi field ini belum bisa diisi"
                : "Opsional"
            }
          >
            <select
              value={values.jobFunctionId}
              onChange={(e) => handleChange("jobFunctionId", e.target.value)}
              disabled={functionOptions.length === 0}
              className={formInputClass}
            >
              <option value="">Tidak ada</option>
              {functionOptions.map((fn) => (
                <option key={fn.id} value={fn.id}>
                  {fn.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Induk Departemen"
            error={errors.parentId}
            hint="Kosongkan kalau ini departemen paling atas (root) di entity tersebut"
          >
            <select
              value={values.parentId}
              onChange={(e) => handleChange("parentId", e.target.value)}
              className={formInputClass}
            >
              <option value="">Tidak ada (root)</option>
              {parentOptions
                .filter((p) => p.id !== departemenId)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.kode})
                  </option>
                ))}
            </select>
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Link
              href="/organisasi/departemen"
              className="rounded-xl bg-slate-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {saving
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Departemen"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
