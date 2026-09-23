"use client";


import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import { Card, CardHeader, Field, Input, Select, Textarea } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { mustBeEmail, requireText, requireSelection } from "@/lib/validation";
import { useFormValues } from "@/hooks/useFormValues";
import {
  createVendor,
  getVendor,
  updateVendor,
} from "../api/vendor";
import {
  PENYELENGGARA_TIPE_LABEL,
  toVendorInput,
  type Penyelenggara,
  type PenyelenggaraInput,
  type PenyelenggaraTipe,
} from "../model/penyelenggara";

/** Jenis boleh kosong selama form belum diisi, jadi tipenya dilonggarkan. */
type FormValues = Omit<PenyelenggaraInput, "tipe"> & {
  tipe: PenyelenggaraTipe | "";
};

const emptyForm: FormValues = {
  nama: "",
  tipe: "",
  telepon: "",
  email: "",
  website: "",
  kota: "",
  alamat: "",
  picNama: "",
  picTelepon: "",
  picEmail: "",
  picJabatan: "",
  aktif: true,
};

// Nama field di backend berbeda dengan key form, jadi error 422 perlu dipetakan.
const FIELD_MAP = {
  name: "nama",
  classification: "tipe",
  phone: "telepon",
  city: "kota",
  address: "alamat",
  pic_name: "picNama",
  pic_phone: "picTelepon",
  pic_email: "picEmail",
  pic_position: "picJabatan",
  status: "aktif",
} as const;

const TIPE_OPTIONS = (
  Object.keys(PENYELENGGARA_TIPE_LABEL) as PenyelenggaraTipe[]
).map((tipe) => ({ value: tipe, label: PENYELENGGARA_TIPE_LABEL[tipe] }));

interface PenyelenggaraFormProps {
  mode: "create" | "edit";
  /** Wajib untuk mode edit */
  vendorId?: string;
}

export function PenyelenggaraForm({ mode, vendorId }: PenyelenggaraFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const detail = useAsyncData(
    (signal) => getVendor(vendorId as string, signal),
    { deps: [vendorId], enabled: isEdit && Boolean(vendorId) },
  );

  const [values, setValues] = useFormValues<Penyelenggara, FormValues>(
    detail.data,
    toVendorInput,
    emptyForm,
  );

  const { submit, saving, errors, formError } = useFormSubmit<FormValues>({
    fieldMap: FIELD_MAP,
    validate: (form) => ({
      nama: requireText(form.nama, "Nama Penyelenggara"),
      tipe: requireSelection(form.tipe, "Jenis Penyelenggara"),
      email: mustBeEmail(form.email, "E-Mail"),
      picEmail: mustBeEmail(form.picEmail, "E-Mail PIC"),
    }),
    onSubmit: async (form) => {
      const input = { ...form, tipe: form.tipe as PenyelenggaraTipe };

      if (isEdit && vendorId) {
        await updateVendor(vendorId, input);
      } else {
        await createVendor(input);
      }

      router.push("/penyelenggara-pelatihan");
    },
  });

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  /** Semua isian teks di form ini bentuknya sama, jadi dirakit satu tempat. */
  function textField(
    key: Exclude<keyof FormValues, "aktif" | "tipe">,
    label: string,
    placeholder: string,
    type: "text" | "email" = "text",
    required = false,
  ) {
    return (
      <Field label={label} required={required} error={errors[key]}>
        <Input
          type={type}
          value={values[key]}
          invalid={Boolean(errors[key])}
          disabled={saving}
          placeholder={placeholder}
          onChange={(event) => setField(key, event.target.value)}
        />
      </Field>
    );
  }

  return (
    <FormPageLayout
      variant="plain"
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Data Penyelenggara", href: "/penyelenggara-pelatihan" },
        { label: isEdit ? "Edit Penyelenggara" : "Tambah Penyelenggara" },
      ]}
      title={
        isEdit
          ? "Edit Penyelenggara Pelatihan"
          : "Tambah Penyelenggara Pelatihan Baru"
      }
      description="Lengkapi Identitas Penyelenggara Pelatihan"
      backHref="/penyelenggara-pelatihan"
      loading={detail.loading}
      loadingLabel="Memuat data penyelenggara..."
      error={formError ?? detail.error}
      saving={saving}
      submitLabel={isEdit ? "Simpan Perubahan" : "Simpan Penyelenggara"}
      onSubmit={() => submit(values)}
    >
      <Card padding="roomy">
        <CardHeader title="Informasi Penyelenggara" />

        <div className="mt-5 space-y-5">
          {textField("nama", "Nama Penyelenggara", "Cth. PT. MarkPlus Indonesia", "text", true)}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Jenis Penyelenggara" required error={errors.tipe}>
              <Select
                value={values.tipe}
                invalid={Boolean(errors.tipe)}
                disabled={saving}
                placeholder="Pilih..."
                options={TIPE_OPTIONS}
                onChange={(event) =>
                  setField("tipe", event.target.value as PenyelenggaraTipe)
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

            {textField("telepon", "Nomor Telpon", "0812-xxxx-xxxx")}
            {textField("email", "E-Mail", "markpxxxx@gmxx.com", "email")}
            {textField("kota", "Kota", "Cth. Jakarta")}
            {textField("website", "Website", "https://markplus.com")}
          </div>

          <Field label="Alamat" error={errors.alamat}>
            <Textarea
              value={values.alamat}
              invalid={Boolean(errors.alamat)}
              disabled={saving}
              placeholder="Alamat lengkap kantor penyelenggara"
              onChange={(event) => setField("alamat", event.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card padding="roomy">
        <CardHeader title="Informasi PIC" />

        <div className="mt-5 space-y-5">
          {textField("picNama", "Nama PIC", "Cth. Budi Santoso")}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {textField("picTelepon", "Nomor Telpon PIC", "0812-xxxx-xxxx")}
            {textField("picEmail", "E-Mail PIC", "markpxxxx@gmxx.com", "email")}
          </div>

          {textField("picJabatan", "Jabatan PIC", "Cth. Sales and Marketing")}
        </div>
      </Card>
    </FormPageLayout>
  );
}
