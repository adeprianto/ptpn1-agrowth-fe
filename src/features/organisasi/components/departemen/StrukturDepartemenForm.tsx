"use client";


import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import { Field, Input, Select } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { useFormValues } from "@/hooks/useFormValues";
import {
  createDepartemen,
  getDepartemen,
  getDepartemenOptions,
  updateDepartemen,
} from "../../api/departemen";
import { getJobFunctions, getOrganizationTypes } from "../../api/masterData";
import { getEntityOptions } from "../../api/entityOptions";
import { toSelectOptions } from "../../model/masterData";
import type { Departemen, DepartemenInput } from "../../model/departemen";
import { EntityPicker } from "../shared/EntityPicker";

/** Isian form; semua string karena datang dari input/select. */
interface FormValues extends Omit<DepartemenInput, "level"> {
  level: string;
}

const emptyValues: FormValues = {
  kode: "",
  nama: "",
  level: "1",
  tipeId: "",
  entityId: "",
  jobFunctionId: "",
  indukId: "",
};

// Nama field di backend berbeda dengan key form, jadi error 422 perlu dipetakan.
const FIELD_MAP = {
  code: "kode",
  name: "nama",
  organization_type_id: "tipeId",
  entity_id: "entityId",
  job_function_id: "jobFunctionId",
  parent_id: "indukId",
} as const;

function toInput(values: FormValues): DepartemenInput {
  return {
    ...values,
    level: Number(values.level),
    jobFunctionId: values.jobFunctionId || null,
    indukId: values.indukId || null,
  };
}

interface StrukturDepartemenFormProps {
  mode: "create" | "edit";
  /** Dipakai saat mode "create" untuk prefill Entity dari halaman daftar */
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

  const { data: entityOptions } = useAsyncData(getEntityOptions);
  const { data: tipeOptions } = useAsyncData(getOrganizationTypes);
  const { data: functionOptions } = useAsyncData(getJobFunctions);

  const detail = useAsyncData(
    (signal) => getDepartemen(departemenId as string, signal),
    { deps: [departemenId], enabled: isEdit && Boolean(departemenId) },
  );

  const [values, setValues] = useFormValues<Departemen, FormValues>(
    detail.data,
    (departemen) => ({
      kode: departemen.kode,
      nama: departemen.nama,
      level: String(departemen.level),
      tipeId: departemen.tipe?.id ?? "",
      entityId: departemen.entityId ?? "",
      jobFunctionId: departemen.jobFunction?.id ?? "",
      indukId: departemen.indukId ?? "",
    }),
    { ...emptyValues, entityId: defaultEntityId ?? "" },
  );

  // mode tambah tanpa prefill: pakai entity pertama yang tersedia
  const entityId =
    values.entityId || (!isEdit ? (entityOptions?.[0]?.id ?? "") : "");

  const { submit, saving, errors, formError } = useFormSubmit<FormValues>({
    fieldMap: FIELD_MAP,
    validate: (form) => ({
      entityId: entityId ? undefined : "Entity wajib dipilih",
      kode: form.kode.trim() ? undefined : "Kode wajib diisi",
      nama: form.nama.trim() ? undefined : "Nama Departemen wajib diisi",
      tipeId: form.tipeId ? undefined : "Tipe wajib dipilih",
    }),
    onSubmit: async (form) => {
      const input = toInput({ ...form, entityId });

      if (isEdit && departemenId) {
        await updateDepartemen(departemenId, input);
      } else {
        await createDepartemen(input);
      }

      router.push("/organisasi/departemen");
    },
  });

  // Induk HARUS dari entity yang sama, jadi daftarnya ikut entity terpilih
  const { data: indukOptions } = useAsyncData(
    (signal) => getDepartemenOptions(entityId, signal),
    { deps: [entityId], enabled: Boolean(entityId) },
  );

  function handleChange<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
      // pindah entity = induk lama tidak valid lagi
      ...(key === "entityId" ? { indukId: "" } : {}),
    }));
  }

  return (
    <FormPageLayout
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Organisasi", href: "/organisasi" },
        { label: "Struktur Departemen", href: "/organisasi/departemen" },
        { label: isEdit ? "Edit Departemen" : "Tambah Departemen" },
      ]}
      title={isEdit ? "Edit Departemen" : "Tambah Departemen"}
      description="Susunan departemen di dalam satu entity (Head Office, Regional, atau Unit)"
      backHref="/organisasi/departemen"
      loading={detail.loading}
      loadingLabel="Memuat data departemen..."
      error={formError ?? detail.error}
      saving={saving}
      submitLabel={isEdit ? "Simpan Perubahan" : "Simpan Departemen"}
      onSubmit={() => submit(values)}
    >
      <Field label="Entity" required error={errors.entityId}>
        <EntityPicker
          options={entityOptions}
          value={entityId}
          invalid={Boolean(errors.entityId)}
          placeholder="Pilih..."
          onChange={(value) => handleChange("entityId", value)}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Kode" required error={errors.kode}>
          <Input
            value={values.kode}
            invalid={Boolean(errors.kode)}
            placeholder="Cth. HO-SDM-REK"
            onChange={(event) => handleChange("kode", event.target.value)}
          />
        </Field>

        <Field label="Nama Departemen" required error={errors.nama}>
          <Input
            value={values.nama}
            invalid={Boolean(errors.nama)}
            placeholder="Cth. Bagian Rekrutmen"
            onChange={(event) => handleChange("nama", event.target.value)}
          />
        </Field>

        <Field label="Tipe" required error={errors.tipeId}>
          <Select
            value={values.tipeId}
            invalid={Boolean(errors.tipeId)}
            placeholder="Pilih..."
            options={toSelectOptions(tipeOptions ?? [])}
            onChange={(event) => handleChange("tipeId", event.target.value)}
          />
        </Field>

        <Field
          label="Level"
          required
          error={errors.level}
          hint="1 = paling atas (mis. Direktorat), makin besar makin dalam"
        >
          <Input
            type="number"
            min={1}
            max={5}
            value={values.level}
            invalid={Boolean(errors.level)}
            onChange={(event) => handleChange("level", event.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Job Function"
        error={errors.jobFunctionId}
        hint={
          functionOptions?.length === 0
            ? "Master Job Function masih kosong, jadi field ini belum bisa diisi"
            : "Opsional"
        }
      >
        <Select
          value={values.jobFunctionId ?? ""}
          disabled={functionOptions?.length === 0}
          onChange={(event) => handleChange("jobFunctionId", event.target.value)}
        >
          <option value="">Tidak ada</option>
          {toSelectOptions(functionOptions ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Induk Departemen"
        error={errors.indukId}
        hint="Kosongkan kalau ini departemen paling atas (root) di entity tersebut"
      >
        <Select
          value={values.indukId ?? ""}
          onChange={(event) => handleChange("indukId", event.target.value)}
        >
          <option value="">Tidak ada (root)</option>
          {(indukOptions ?? [])
            // sebuah departemen tidak boleh jadi induk dirinya sendiri
            .filter((option) => option.id !== departemenId)
            .map((option) => (
              <option key={option.id} value={option.id}>
                {option.nama} ({option.kode})
              </option>
            ))}
        </Select>
      </Field>
    </FormPageLayout>
  );
}
