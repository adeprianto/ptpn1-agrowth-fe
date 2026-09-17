"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormField, formInputClass } from "@/components/shared/FormField";
import {
  jobFamilies,
  strukturDepartemen,
  getEntityLabel,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";

const levelChoices = ["BOD-1", "BOD-2", "BOD-3", "BOD-4"];

export interface JabatanFormValues {
  code: string;
  namaJabatanLengkap: string;
  level: string;
  jobFamilyCode: string;
  organisasiCode: string;
}

interface MasterJabatanFormProps {
  mode: "create" | "edit";
  initialValues?: JabatanFormValues;
}

const emptyValues: JabatanFormValues = {
  code: "",
  namaJabatanLengkap: "",
  level: "",
  jobFamilyCode: "",
  organisasiCode: "",
};

export function MasterJabatanForm({
  mode,
  initialValues,
}: MasterJabatanFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<JabatanFormValues>(
    initialValues ?? emptyValues,
  );

  const hoNodes = strukturDepartemen.filter((n) => n.entityCode === "HO");
  const regionalEntityCodes = Array.from(
    new Set(
      strukturDepartemen
        .filter((n) => n.entityCode !== "HO")
        .map((n) => n.entityCode),
    ),
  );

  function handleChange<K extends keyof JabatanFormValues>(
    key: K,
    value: JabatanFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Belum ada backend — untuk sekarang cuma log + kembali ke daftar.
    // TODO: POST/PUT /api/v1/master/jabatan
    console.log(
      `${mode === "create" ? "Tambah" : "Edit"} jabatan (dummy):`,
      values,
    );
    router.push("/organisasi/jabatan");
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Master Jabatan", href: "/organisasi/jabatan" },
          { label: mode === "create" ? "Tambah Jabatan" : "Edit Jabatan" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Link
          href="/organisasi/jabatan"
          aria-label="Kembali ke daftar jabatan"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === "create" ? "Tambah Jabatan Baru" : "Edit Jabatan"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lengkapi kode, level, Job Family, dan posisi di struktur organisasi
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Code" required>
            <input
              type="text"
              required
              value={values.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="Cth. JAB-007"
              className={formInputClass}
            />
          </FormField>

          <FormField label="Level" required>
            <select
              required
              value={values.level}
              onChange={(e) => handleChange("level", e.target.value)}
              className={formInputClass}
            >
              <option value="" disabled>
                Pilih...
              </option>
              {levelChoices.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Nama Jabatan Lengkap" required>
          <input
            type="text"
            required
            value={values.namaJabatanLengkap}
            onChange={(e) => handleChange("namaJabatanLengkap", e.target.value)}
            placeholder="Cth. Kepala Divisi Pengembangan SDM"
            className={formInputClass}
          />
        </FormField>

        <FormField label="Job Family" required>
          <select
            required
            value={values.jobFamilyCode}
            onChange={(e) => handleChange("jobFamilyCode", e.target.value)}
            className={formInputClass}
          >
            <option value="" disabled>
              Pilih...
            </option>
            {jobFamilies.map((jf) => (
              <option key={jf.code} value={jf.code}>
                {jf.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Organisasi"
          required
          hint="Job Function otomatis ikut dari sini — jabatan ditempatkan di salah satu departemen di struktur organisasi."
        >
          <select
            required
            value={values.organisasiCode}
            onChange={(e) => handleChange("organisasiCode", e.target.value)}
            className={formInputClass}
          >
            <option value="" disabled>
              Pilih...
            </option>
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
                  .filter((n) => n.entityCode === entityCode)
                  .map((node) => (
                    <option key={node.code} value={node.code}>
                      {node.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/organisasi/jabatan"
            className="rounded-xl bg-slate-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            {mode === "create" ? "Simpan Jabatan" : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function jabatanRowToFormValues(
  row: JabatanMasterRow,
): JabatanFormValues {
  return {
    code: row.code,
    namaJabatanLengkap: row.namaJabatanLengkap,
    level: row.level,
    jobFamilyCode: row.jobFamilyCode,
    organisasiCode: row.organisasiCode,
  };
}
