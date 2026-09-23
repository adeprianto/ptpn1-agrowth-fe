"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import { Field, Input, Select } from "@/components/ui";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { requireText, requireSelection } from "@/lib/validation";
import {
  jobFamilies,
  strukturDepartemen,
  getEntityLabel,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";

const LEVEL_OPTIONS = ["BOD-1", "BOD-2", "BOD-3", "BOD-4"].map((level) => ({
  value: level,
  label: level,
}));

export interface JabatanFormValues {
  code: string;
  namaJabatanLengkap: string;
  level: string;
  jobFamilyCode: string;
  organisasiCode: string;
}

const emptyValues: JabatanFormValues = {
  code: "",
  namaJabatanLengkap: "",
  level: "",
  jobFamilyCode: "",
  organisasiCode: "",
};

interface MasterJabatanFormProps {
  mode: "create" | "edit";
  initialValues?: JabatanFormValues;
}

export function MasterJabatanForm({
  mode,
  initialValues,
}: MasterJabatanFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<JabatanFormValues>(
    initialValues ?? emptyValues,
  );

  const hoNodes = strukturDepartemen.filter((node) => node.entityCode === "HO");
  const regionalEntityCodes = Array.from(
    new Set(
      strukturDepartemen
        .filter((node) => node.entityCode !== "HO")
        .map((node) => node.entityCode),
    ),
  );

  function handleChange<K extends keyof JabatanFormValues>(
    key: K,
    value: JabatanFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const { submit, saving, errors, formError } = useFormSubmit<JabatanFormValues>({
    validate: (form) => ({
      code: requireText(form.code, "Code"),
      level: requireSelection(form.level, "Level"),
      namaJabatanLengkap: requireText(form.namaJabatanLengkap, "Nama Jabatan Lengkap"),
      jobFamilyCode: requireSelection(form.jobFamilyCode, "Job Family"),
      organisasiCode: requireSelection(form.organisasiCode, "Organisasi"),
    }),
    onSubmit: async () => {
      // DUMMY — master jabatan belum punya endpoint.
      // TODO: POST/PUT /api/v1/master/jabatan
      router.push("/organisasi/jabatan");
    },
  });

  return (
    <FormPageLayout
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Organisasi", href: "/organisasi" },
        { label: "Master Jabatan", href: "/organisasi/jabatan" },
        { label: mode === "create" ? "Tambah Jabatan" : "Edit Jabatan" },
      ]}
      title={mode === "create" ? "Tambah Jabatan Baru" : "Edit Jabatan"}
      description="Lengkapi kode, level, Job Family, dan posisi di struktur organisasi"
      backHref="/organisasi/jabatan"
      error={formError}
      saving={saving}
      submitLabel={mode === "create" ? "Simpan Jabatan" : "Simpan Perubahan"}
      onSubmit={() => submit(values)}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Code" required error={errors.code}>
          <Input
            invalid={Boolean(errors.code)}
            disabled={saving}
            value={values.code}
            placeholder="Cth. JAB-007"
            onChange={(event) => handleChange("code", event.target.value)}
          />
        </Field>

        <Field label="Level" required error={errors.level}>
          <Select
            invalid={Boolean(errors.level)}
            disabled={saving}
            value={values.level}
            placeholder="Pilih..."
            options={LEVEL_OPTIONS}
            onChange={(event) => handleChange("level", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Nama Jabatan Lengkap" required error={errors.namaJabatanLengkap}>
        <Input
          invalid={Boolean(errors.namaJabatanLengkap)}
          disabled={saving}
          value={values.namaJabatanLengkap}
          placeholder="Cth. Kepala Divisi Pengembangan SDM"
          onChange={(event) =>
            handleChange("namaJabatanLengkap", event.target.value)
          }
        />
      </Field>

      <Field label="Job Family" required error={errors.jobFamilyCode}>
        <Select
          invalid={Boolean(errors.jobFamilyCode)}
          disabled={saving}
          value={values.jobFamilyCode}
          placeholder="Pilih..."
          options={jobFamilies.map((family) => ({
            value: family.code,
            label: family.name,
          }))}
          onChange={(event) => handleChange("jobFamilyCode", event.target.value)}
        />
      </Field>

      <Field
        label="Organisasi"
        required
        error={errors.organisasiCode}
        hint="Job Function otomatis ikut dari sini — jabatan ditempatkan di salah satu departemen di struktur organisasi."
      >
        <Select
          invalid={Boolean(errors.organisasiCode)}
          disabled={saving}
          value={values.organisasiCode}
          placeholder="Pilih..."
          onChange={(event) => handleChange("organisasiCode", event.target.value)}
        >
          <optgroup label="Head Office">
            {hoNodes.map((node) => (
              <option key={node.code} value={node.code}>
                {node.name}
              </option>
            ))}
          </optgroup>
          {regionalEntityCodes.map((entityCode) => (
            <optgroup key={entityCode} label={getEntityLabel(entityCode)}>
              {strukturDepartemen
                .filter((node) => node.entityCode === entityCode)
                .map((node) => (
                  <option key={node.code} value={node.code}>
                    {node.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </Select>
      </Field>
    </FormPageLayout>
  );
}

export function positionRowToFormValues(row: JabatanMasterRow): JabatanFormValues {
  return {
    code: row.code,
    namaJabatanLengkap: row.namaJabatanLengkap,
    level: row.level,
    jobFamilyCode: row.jobFamilyCode,
    organisasiCode: row.organisasiCode,
  };
}
