"use client";

import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import {
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  TagInput,
  Textarea,
  type SelectOption,
} from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { requireText, requireSelection } from "@/lib/validation";
import { useFormValues } from "@/hooks/useFormValues";
import { getVendorList } from "@/features/penyelenggara-pelatihan/api/vendor";
import { createTraining, getTraining, updateTraining } from "../api/pelatihan";
import {
  BIDANG_LABEL,
  JENIS_KOMPETENSI_LABEL,
  JENIS_PSDM_LABEL,
  toTrainingInput,
  type BidangPelatihan,
  type JenisKompetensi,
  type JenisPsdm,
  type Pelatihan,
  type PelatihanInput,
} from "../model/pelatihan";

/** Dropdown boleh kosong selama form belum diisi, jadi tipenya dilonggarkan. */
type FormValues = Omit<PelatihanInput, "jenisPsdm" | "jenisKompetensi" | "bidang"> & {
  jenisPsdm: JenisPsdm | "";
  jenisKompetensi: JenisKompetensi | "";
  bidang: BidangPelatihan | "";
};

const emptyForm: FormValues = {
  nama: "",
  penyelenggaraId: "",
  jenisPsdm: "",
  jenisKompetensi: "",
  bidang: "",
  deskripsi: "",
  tags: [],
  aktif: true,
};

// Nama field di backend berbeda dengan key form, jadi error 422 perlu dipetakan.
const FIELD_MAP = {
  name: "nama",
  vendor_id: "penyelenggaraId",
  hr_development_type: "jenisPsdm",
  competency_type: "jenisKompetensi",
  learning_sector: "bidang",
  description: "deskripsi",
  status: "aktif",
} as const;

/** Ubah peta nilai→label jadi opsi dropdown. */
function optionsFrom<T extends string>(labels: Record<T, string>): SelectOption[] {
  return (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }));
}

const JENIS_PSDM_OPTIONS = optionsFrom(JENIS_PSDM_LABEL);
const JENIS_KOMPETENSI_OPTIONS = optionsFrom(JENIS_KOMPETENSI_LABEL);
const BIDANG_OPTIONS = optionsFrom(BIDANG_LABEL);

interface PelatihanFormProps {
  mode: "create" | "edit";
  /** Wajib untuk mode edit */
  trainingId?: string;
}

export function PelatihanForm({ mode, trainingId }: PelatihanFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const detail = useAsyncData(
    (signal) => getTraining(trainingId as string, signal),
    { deps: [trainingId], enabled: isEdit && Boolean(trainingId) },
  );

  // Dropdown penyelenggara diisi dari data vendor yang sebenarnya.
  const penyelenggara = useAsyncData((signal) =>
    getVendorList({ perPage: 200, sort: "name", direction: "asc" }, signal),
  );

  const penyelenggaraOptions: SelectOption[] =
    penyelenggara.data?.rows.map((row) => ({ value: row.id, label: row.nama })) ?? [];

  const [values, setValues] = useFormValues<Pelatihan, FormValues>(
    detail.data,
    toTrainingInput,
    emptyForm,
  );

  const { submit, saving, errors, formError } = useFormSubmit<FormValues>({
    fieldMap: FIELD_MAP,
    validate: (form) => ({
      nama: requireText(form.nama, "Nama Pelatihan"),
      penyelenggaraId: requireSelection(form.penyelenggaraId, "Penyelenggara Pelatihan"),
      jenisPsdm: requireSelection(form.jenisPsdm, "Jenis Pengembangan SDM"),
      jenisKompetensi: requireSelection(form.jenisKompetensi, "Jenis Kompetensi"),
      bidang: requireSelection(form.bidang, "Bidang Pelatihan"),
    }),
    onSubmit: async (form) => {
      const input: PelatihanInput = {
        ...form,
        jenisPsdm: form.jenisPsdm as JenisPsdm,
        jenisKompetensi: form.jenisKompetensi as JenisKompetensi,
        bidang: form.bidang as BidangPelatihan,
      };

      if (isEdit && trainingId) {
        await updateTraining(trainingId, input);
      } else {
        await createTraining(input);
      }

      router.push("/program-pelatihan");
    },
  });

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <FormPageLayout
      variant="plain"
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Program Pelatihan", href: "/program-pelatihan" },
        { label: isEdit ? "Edit Program Pelatihan" : "Tambah Program Pelatihan" },
      ]}
      title={
        isEdit ? "Edit Program Pelatihan" : "Tambah Program Pelatihan Baru"
      }
      description="Lengkapi Data Program Pelatihan"
      backHref="/program-pelatihan"
      loading={detail.loading}
      loadingLabel="Memuat data pelatihan..."
      error={formError ?? detail.error}
      saving={saving}
      submitLabel={isEdit ? "Simpan Perubahan" : "Simpan Pelatihan"}
      onSubmit={() => submit(values)}
    >
      <Card padding="roomy">
        <CardHeader title="Data Pelatihan" />

        <div className="mt-5 space-y-5">
          <Field label="Nama Pelatihan" required error={errors.nama}>
            <Input
              value={values.nama}
              invalid={Boolean(errors.nama)}
              disabled={saving}
              placeholder="Cth. Agribusiness Investment Management Series (AIMS)"
              onChange={(event) => setField("nama", event.target.value)}
            />
          </Field>

          <Field label="Penyelenggara Pelatihan" required error={errors.penyelenggaraId}>
            <Select
              value={values.penyelenggaraId}
              invalid={Boolean(errors.penyelenggaraId)}
              disabled={saving || penyelenggara.loading}
              placeholder={
                penyelenggara.loading ? "Memuat penyelenggara..." : "Pilih..."
              }
              options={penyelenggaraOptions}
              onChange={(event) => setField("penyelenggaraId", event.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Jenis Pengembangan SDM"
              required
              error={errors.jenisPsdm}
            >
              <Select
                value={values.jenisPsdm}
                invalid={Boolean(errors.jenisPsdm)}
                disabled={saving}
                placeholder="Pilih..."
                options={JENIS_PSDM_OPTIONS}
                onChange={(event) =>
                  setField("jenisPsdm", event.target.value as JenisPsdm)
                }
              />
            </Field>

            <Field
              label="Jenis Kompetensi Pelatihan"
              required
              error={errors.jenisKompetensi}
            >
              <Select
                value={values.jenisKompetensi}
                invalid={Boolean(errors.jenisKompetensi)}
                disabled={saving}
                placeholder="Pilih..."
                options={JENIS_KOMPETENSI_OPTIONS}
                onChange={(event) =>
                  setField("jenisKompetensi", event.target.value as JenisKompetensi)
                }
              />
            </Field>

            <Field label="Bidang Pelatihan" required error={errors.bidang}>
              <Select
                value={values.bidang}
                invalid={Boolean(errors.bidang)}
                disabled={saving}
                placeholder="Pilih..."
                options={BIDANG_OPTIONS}
                onChange={(event) =>
                  setField("bidang", event.target.value as BidangPelatihan)
                }
              />
            </Field>

            <Field label="Status" error={errors.aktif}>
              <Select
                value={values.aktif ? "1" : "0"}
                disabled={saving}
                options={[
                  { value: "1", label: "Aktif" },
                  { value: "0", label: "Non-aktif" },
                ]}
                onChange={(event) => setField("aktif", event.target.value === "1")}
              />
            </Field>
          </div>

          <Field
            label="Tag Pelatihan"
            error={errors.tags}
            hint="Ketik satu kata lalu tekan spasi — kata itu langsung jadi tag."
          >
            <TagInput
              value={values.tags}
              disabled={saving}
              invalid={Boolean(errors.tags)}
              placeholder="Cth. digital agribisnis kepemimpinan"
              onChange={(tags) => setField("tags", tags)}
            />
          </Field>

          <Field label="Deskripsi Pelatihan" error={errors.deskripsi}>
            <Textarea
              value={values.deskripsi}
              invalid={Boolean(errors.deskripsi)}
              disabled={saving}
              placeholder="Deskripsi mengenai pelatihan"
              onChange={(event) => setField("deskripsi", event.target.value)}
            />
          </Field>
        </div>
      </Card>
    </FormPageLayout>
  );
}
