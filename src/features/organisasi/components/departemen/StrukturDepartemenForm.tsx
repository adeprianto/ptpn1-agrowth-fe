"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormField, formInputClass } from "@/components/shared/FormField";
import {
  jobFunctions,
  strukturDepartemen,
  getAllEntityOptions,
  type StrukturDepartemenNode,
} from "./masterJabatanDummyData";

export interface DepartemenFormValues {
  code: string;
  nama: string;
  level: string;
  type: string;
  entityCode: string;
  functionCode: string;
  parentId: string;
}

interface StrukturDepartemenFormProps {
  mode: "create" | "edit";
  initialValues?: DepartemenFormValues;
  /** Dipakai saat mode "create" buat prefill Entity dari halaman List */
  defaultEntityCode?: string;
}

function emptyValues(defaultEntityCode: string): DepartemenFormValues {
  return {
    code: "",
    nama: "",
    level: "1",
    type: "",
    entityCode: defaultEntityCode,
    functionCode: "",
    parentId: "",
  };
}

export function StrukturDepartemenForm({
  mode,
  initialValues,
  defaultEntityCode,
}: StrukturDepartemenFormProps) {
  const router = useRouter();
  const entityOptions = getAllEntityOptions();

  const [values, setValues] = useState<DepartemenFormValues>(
    initialValues ?? emptyValues(defaultEntityCode ?? entityOptions[0].code),
  );

  // Parent HARUS dari entity yang sama — pindah Entity di form = reset Parent
  const parentOptions = strukturDepartemen.filter(
    (n) => n.entityCode === values.entityCode,
  );

  function handleChange<K extends keyof DepartemenFormValues>(
    key: K,
    value: DepartemenFormValues[K],
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "entityCode" ? { parentId: "" } : {}),
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Belum ada backend — untuk sekarang cuma log + kembali ke daftar.
    // TODO: POST/PUT /api/v1/master/struktur-departemen
    console.log(
      `${mode === "create" ? "Tambah" : "Edit"} departemen (dummy):`,
      values,
    );
    router.push("/organisasi/departemen");
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Struktur Departemen", href: "/organisasi/departemen" },
          {
            label: mode === "create" ? "Tambah Departemen" : "Edit Departemen",
          },
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
            {mode === "create" ? "Tambah Departemen" : "Edit Departemen"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Departemen ini dipakai sebagai referensi Job Function di Master
            Jabatan
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <FormField label="Entity" required>
          <select
            required
            value={values.entityCode}
            onChange={(e) => handleChange("entityCode", e.target.value)}
            className={formInputClass}
          >
            <optgroup label="Head Office">
              {entityOptions
                .filter((e) => e.isHo)
                .map((e) => (
                  <option key={e.code} value={e.code}>
                    {e.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Regional">
              {entityOptions
                .filter((e) => !e.isHo && !e.code.startsWith("UNIT-"))
                .map((e) => (
                  <option key={e.code} value={e.code}>
                    {e.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Unit (template)">
              {entityOptions
                .filter((e) => e.code.startsWith("UNIT-"))
                .map((e) => (
                  <option key={e.code} value={e.code}>
                    {e.label}
                  </option>
                ))}
            </optgroup>
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Code" required>
            <input
              type="text"
              required
              value={values.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="Cth. ORG-HO-SDM-REK"
              className={formInputClass}
            />
          </FormField>

          <FormField label="Nama Organisasi" required>
            <input
              type="text"
              required
              value={values.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              placeholder="Cth. Bagian Rekrutmen"
              className={formInputClass}
            />
          </FormField>

          <FormField
            label="Level"
            required
            hint="1 = paling atas (mis. Divisi), makin besar makin dalam"
          >
            <input
              type="number"
              min={1}
              required
              value={values.level}
              onChange={(e) => handleChange("level", e.target.value)}
              className={formInputClass}
            />
          </FormField>

          <FormField label="Type" required>
            <input
              type="text"
              required
              value={values.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="Cth. Divisi / Bagian / Seksi"
              className={formInputClass}
            />
          </FormField>
        </div>

        <FormField label="Function" required>
          <select
            required
            value={values.functionCode}
            onChange={(e) => handleChange("functionCode", e.target.value)}
            className={formInputClass}
          >
            <option value="" disabled>
              Pilih...
            </option>
            {jobFunctions.map((fn) => (
              <option key={fn.code} value={fn.code}>
                {fn.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Parent Departemen"
          hint="Kosongkan kalau ini departemen paling atas (root) di entity tersebut"
        >
          <select
            value={values.parentId}
            onChange={(e) => handleChange("parentId", e.target.value)}
            className={formInputClass}
          >
            <option value="">Tidak ada (root)</option>
            {parentOptions.map((node: StrukturDepartemenNode) => (
              <option key={node.id} value={node.id}>
                {node.name}
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
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            {mode === "create" ? "Simpan Departemen" : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function departemenNodeToFormValues(
  node: StrukturDepartemenNode,
): DepartemenFormValues {
  return {
    code: node.code,
    nama: node.name,
    level: String(node.level),
    type: node.type,
    entityCode: node.entityCode,
    functionCode: node.functionCode ?? "",
    parentId: node.parentId ?? "",
  };
}
