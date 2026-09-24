"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import { Button, Field, Input, Select } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { requireText, requireSelection } from "@/lib/validation";
import { useFormValues } from "@/hooks/useFormValues";
import { createUnit, getUnit, updateUnit } from "../../api/unit";
import { getRegionals } from "../../api/regional";
import { getBusinessTypes, getOperationalCategories } from "../../api/masterData";
import { withDistinctLabels, type MasterItem } from "../../model/masterData";
import type { Unit, UnitInput } from "../../model/unit";
import { getUnitTypeDisplay } from "./jenisUnit";

/** Satu baris pasangan jenis + komoditas; nilai select selalu string. */
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

const emptyRow: OperasionalRow = { jenisId: "", komoditasId: "" };

const emptyForm: FormValues = {
  kode: "",
  nama: "",
  regionalId: "",
  operasional: [emptyRow],
};

// Nama field di backend berbeda dengan key form, jadi error 422 perlu dipetakan.
const FIELD_MAP = { code: "kode", name: "nama", parent_id: "regionalId" } as const;

interface UnitFormOptions {
  regional: MasterItem[];
  jenis: MasterItem[];
  komoditas: MasterItem[];
}

async function getUnitFormOptions(signal: AbortSignal): Promise<UnitFormOptions> {
  const [regionals, jenis, komoditas] = await Promise.all([
    getRegionals({ perPage: 100 }, signal),
    getOperationalCategories(signal),
    getBusinessTypes(signal),
  ]);

  return {
    regional: regionals.rows.map((row) => ({
      id: row.id,
      kode: row.kode,
      nama: row.nama,
    })),
    jenis: jenis.map((item) => ({ ...item, nama: getUnitTypeDisplay(item).label })),
    komoditas: withDistinctLabels(komoditas),
  };
}

interface UnitFormProps {
  mode: "create" | "edit";
  /** Wajib untuk mode edit */
  unitId?: string;
}

export function UnitForm({ mode, unitId }: UnitFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const { data: options, error: optionsError } = useAsyncData(getUnitFormOptions);
  const detail = useAsyncData((signal) => getUnit(unitId as string, signal), {
    deps: [unitId],
    enabled: isEdit && Boolean(unitId),
  });

  const [values, setValues] = useFormValues<Unit, FormValues>(
    detail.data,
    (unit) => {
      const operasional = unit.operasional.map((row) => ({
        jenisId: row.jenisId ?? "",
        komoditasId: row.komoditasId ?? "",
      }));

      return {
        kode: unit.kode,
        nama: unit.nama,
        regionalId: unit.regionalId ?? "",
        operasional: operasional.length > 0 ? operasional : [emptyRow],
      };
    },
    emptyForm,
  );

  const jenisOptions = useMemo(
    () => options?.jenis.map((item) => ({ value: item.id, label: item.nama })) ?? [],
    [options],
  );
  const komoditasOptions = useMemo(
    () => options?.komoditas.map((item) => ({ value: item.id, label: item.nama })) ?? [],
    [options],
  );

  const { submit, saving, errors, formError } = useFormSubmit<FormValues>({
    fieldMap: FIELD_MAP,
    validate: (form) => ({
      kode: requireText(form.kode, "Kode Unit"),
      nama: requireText(form.nama, "Nama Unit"),
      regionalId: requireSelection(form.regionalId, "Regional"),
    }),
    onSubmit: async (form) => {
      const input: UnitInput = {
        kode: form.kode,
        nama: form.nama,
        regionalId: form.regionalId,
        // baris tanpa jenis diabaikan; unit boleh tanpa data operasional
        operasional: form.operasional
          .filter((row) => row.jenisId)
          .map((row) => ({
            jenisId: row.jenisId,
            komoditasId: row.komoditasId || null,
          })),
      };

      if (isEdit && unitId) {
        await updateUnit(unitId, input);
      } else {
        await createUnit(input);
      }

      router.push("/dashboard/organisasi/unit");
    },
  });

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function setOperationalRow(index: number, row: Partial<OperasionalRow>) {
    setValues((prev) => ({
      ...prev,
      operasional: prev.operasional.map((current, i) =>
        i === index ? { ...current, ...row } : current,
      ),
    }));
  }

  return (
    <FormPageLayout
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Organisasi", href: "/dashboard/organisasi" },
        { label: "Unit", href: "/dashboard/organisasi/unit" },
        { label: isEdit ? "Edit Unit" : "Tambah Unit" },
      ]}
      title={isEdit ? "Edit Unit" : "Tambah Unit"}
      description="Satu unit bisa punya lebih dari satu pasangan jenis dan komoditas."
      backHref="/dashboard/organisasi/unit"
      loading={detail.loading}
      loadingLabel="Memuat data unit..."
      error={formError ?? detail.error ?? optionsError}
      saving={saving}
      submitLabel={isEdit ? "Simpan Perubahan" : "Simpan Unit"}
      onSubmit={() => submit(values)}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Kode Unit" required error={errors.kode}>
          <Input
            value={values.kode}
            invalid={Boolean(errors.kode)}
            placeholder="Cth. UNIT101"
            onChange={(event) => setField("kode", event.target.value)}
          />
        </Field>

        <Field label="Nama Unit" required error={errors.nama}>
          <Input
            value={values.nama}
            invalid={Boolean(errors.nama)}
            placeholder="Cth. Kebun Sei Rokan"
            onChange={(event) => setField("nama", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Regional" required error={errors.regionalId}>
        <Select
          value={values.regionalId}
          invalid={Boolean(errors.regionalId)}
          placeholder="Pilih Regional"
          options={
            options?.regional.map((row) => ({ value: row.id, label: row.nama })) ?? []
          }
          onChange={(event) => setField("regionalId", event.target.value)}
        />
      </Field>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="block text-sm font-medium text-slate-700">
            Jenis &amp; Komoditas
          </span>
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() =>
              setValues((prev) => ({
                ...prev,
                operasional: [...prev.operasional, emptyRow],
              }))
            }
          >
            Tambah Baris
          </Button>
        </div>

        <div className="space-y-2">
          {values.operasional.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                className="flex-1"
                value={row.jenisId}
                placeholder="Pilih Jenis"
                options={jenisOptions}
                onChange={(event) =>
                  setOperationalRow(index, { jenisId: event.target.value })
                }
              />

              <Select
                className="flex-1"
                value={row.komoditasId}
                placeholder="Tanpa Komoditas"
                options={komoditasOptions}
                onChange={(event) =>
                  setOperationalRow(index, { komoditasId: event.target.value })
                }
              />

              <button
                type="button"
                onClick={() =>
                  setValues((prev) => ({
                    ...prev,
                    operasional: prev.operasional.filter((_, i) => i !== index),
                  }))
                }
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
          Baris yang jenisnya belum dipilih akan diabaikan. Pasangan jenis dan
          komoditas tidak boleh kembar.
        </p>
      </div>
    </FormPageLayout>
  );
}
