"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import { Field, Input, Select } from "@/components/ui";
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

  function handleSubmit() {
    // DUMMY — master jabatan belum punya endpoint.
    // TODO: POST/PUT /api/v1/master/jabatan
    router.push("/organisasi/jabatan");
  }

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
      submitLabel={mode === "create" ? "Simpan Jabatan" : "Simpan Perubahan"}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Code" required>
          <Input
            required
            value={values.code}
            placeholder="Cth. JAB-007"
            onChange={(event) => handleChange("code", event.target.value)}
          />
        </Field>

        <Field label="Level" required>
          <Select
            required
            value={values.level}
            placeholder="Pilih..."
            options={LEVEL_OPTIONS}
            onChange={(event) => handleChange("level", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Nama Jabatan Lengkap" required>
        <Input
          required
          value={values.namaJabatanLengkap}
          placeholder="Cth. Kepala Divisi Pengembangan SDM"
          onChange={(event) =>
            handleChange("namaJabatanLengkap", event.target.value)
          }
        />
      </Field>

      <Field label="Job Family" required>
        <Select
          required
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
        hint="Job Function otomatis ikut dari sini — jabatan ditempatkan di salah satu departemen di struktur organisasi."
      >
        <Select
          required
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

export function jabatanRowToFormValues(row: JabatanMasterRow): JabatanFormValues {
  return {
    code: row.code,
    namaJabatanLengkap: row.namaJabatanLengkap,
    level: row.level,
    jobFamilyCode: row.jobFamilyCode,
    organisasiCode: row.organisasiCode,
  };
}
