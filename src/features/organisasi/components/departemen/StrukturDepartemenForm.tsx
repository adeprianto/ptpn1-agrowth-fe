"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormField, formInputClass } from "@/components/shared/FormField";
import { ApiError } from "@/lib/http-client";
import {
  createDepartemen,
  getDepartemen,
  getDepartemenOptions,
  updateDepartemen,
} from "../../api/departemen";
import { getJobFunctions, getOrganizationTypes } from "../../api/masterData";
import { getEntityOptions, type EntityOption } from "../../api/entityOptions";
import type { EntityType } from "@/types/api/entity";
import type { MasterRef } from "@/types/api/master-data";
import type {
  OrganizationPayload,
  OrganizationResource,
} from "@/types/api/organization";

/**
 * Key form = field StoreOrganizationRequest, supaya error 422 langsung cocok.
 * Semua bernilai string karena isinya dari <input>/<select>.
 */
interface FormValues {
  code: string;
  name: string;
  level: string;
  organization_type_id: string;
  entity_id: string;
  job_function_id: string;
  parent_id: string;
}

const emptyValues: FormValues = {
  code: "",
  name: "",
  level: "1",
  organization_type_id: "",
  entity_id: "",
  job_function_id: "",
  parent_id: "",
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const ENTITY_TYPE_LABEL: Record<EntityType, string> = {
  HEAD_OFFICE: "Head Office",
  REGIONAL: "Regional",
  UNIT: "Unit",
};

interface StrukturDepartemenFormProps {
  mode: "create" | "edit";
  /** Dipakai saat mode "create" buat prefill Entity dari halaman List */
  defaultEntityId?: string;
  /** Wajib untuk mode edit */
  departemenId?: number;
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
    entity_id: defaultEntityId ?? "",
  });
  const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
  const [tipeOptions, setTipeOptions] = useState<MasterRef[]>([]);
  const [functionOptions, setFunctionOptions] = useState<MasterRef[]>([]);
  const [parentOptions, setParentOptions] = useState<OrganizationResource[]>([]);

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
          prev.entity_id || entities.length === 0
            ? prev
            : { ...prev, entity_id: String(entities[0].id) },
        );
      })
      .catch((e: unknown) => {
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
          code: d.code,
          name: d.name,
          level: String(d.level),
          organization_type_id: String(d.organization_type?.id ?? ""),
          entity_id: String(d.entity?.id ?? ""),
          job_function_id: String(d.job_function?.id ?? ""),
          parent_id: String(d.parent?.id ?? ""),
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
    if (!values.entity_id) return;

    const controller = new AbortController();
    getDepartemenOptions(Number(values.entity_id), controller.signal)
      .then(setParentOptions)
      .catch((e: unknown) => {
        if (!controller.signal.aborted) console.error(e);
      });

    return () => controller.abort();
  }, [values.entity_id]);

  function handleChange<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
      // pindah entity = induk lama tidak valid lagi
      ...(key === "entity_id" ? { parent_id: "" } : {}),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload: OrganizationPayload = {
      code: values.code.trim(),
      name: values.name.trim(),
      level: Number(values.level),
      organization_type_id: Number(values.organization_type_id),
      entity_id: Number(values.entity_id),
      job_function_id: values.job_function_id
        ? Number(values.job_function_id)
        : null,
      parent_id: values.parent_id ? Number(values.parent_id) : null,
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
          if (field in emptyValues) {
            fieldErrors[field as keyof FormValues] = messages[0];
          }
        });
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0) setFormError(err.message);
      } else {
        setFormError((err as Error).message);
      }
      setSaving(false);
    }
  }

  const entityTypes: EntityType[] = ["HEAD_OFFICE", "REGIONAL", "UNIT"];

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
          <FormField label="Entity" required error={errors.entity_id}>
            <select
              required
              value={values.entity_id}
              onChange={(e) => handleChange("entity_id", e.target.value)}
              className={formInputClass}
            >
              <option value="" disabled>
                Pilih...
              </option>
              {entityTypes.map((type) => {
                const options = entityOptions.filter((e) => e.type === type);
                if (options.length === 0) return null;

                return (
                  <optgroup key={type} label={ENTITY_TYPE_LABEL[type]}>
                    {options.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Kode" required error={errors.code}>
              <input
                type="text"
                required
                value={values.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="Cth. HO-SDM-REK"
                className={formInputClass}
              />
            </FormField>

            <FormField label="Nama Departemen" required error={errors.name}>
              <input
                type="text"
                required
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Cth. Bagian Rekrutmen"
                className={formInputClass}
              />
            </FormField>

            <FormField
              label="Tipe"
              required
              error={errors.organization_type_id}
            >
              <select
                required
                value={values.organization_type_id}
                onChange={(e) =>
                  handleChange("organization_type_id", e.target.value)
                }
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
            error={errors.job_function_id}
            hint={
              functionOptions.length === 0
                ? "Master Job Function masih kosong, jadi field ini belum bisa diisi"
                : "Opsional"
            }
          >
            <select
              value={values.job_function_id}
              onChange={(e) => handleChange("job_function_id", e.target.value)}
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
            error={errors.parent_id}
            hint="Kosongkan kalau ini departemen paling atas (root) di entity tersebut"
          >
            <select
              value={values.parent_id}
              onChange={(e) => handleChange("parent_id", e.target.value)}
              className={formInputClass}
            >
              <option value="">Tidak ada (root)</option>
              {parentOptions
                .filter((p) => p.id !== departemenId)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
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
