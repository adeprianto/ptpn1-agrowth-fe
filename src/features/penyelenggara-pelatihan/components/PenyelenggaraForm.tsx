"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormField, formInputClass } from "@/components/shared/FormField";
import {
  createVendor,
  getVendor,
  updateVendor,
} from "@/features/penyelenggara-pelatihan/api/vendor";
import { ApiError } from "@/lib/http-client";
import {
  VENDOR_TYPE_LABEL,
  type VendorPayload,
  type VendorType,
} from "@/types/api/vendor";

/**
 * Key form dibuat sama persis dengan field di StoreVendorRequest, supaya error
 * validasi 422 bisa langsung dipetakan ke input tanpa tabel penerjemah.
 * `is_lpp` tidak ada di sini karena backend menurunkannya dari classification.
 */
type FormValues = Omit<VendorPayload, "classification" | "status"> & {
  classification: VendorType | "";
  status: boolean;
};

const emptyForm: FormValues = {
  name: "",
  classification: "",
  phone: "",
  email: "",
  website: "",
  city: "",
  address: "",
  pic_name: "",
  pic_phone: "",
  pic_email: "",
  pic_position: "",
  status: true,
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

/** Input kosong dikirim sebagai null, bukan "" (kolomnya nullable di backend). */
const orNull = (value: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

interface PenyelenggaraFormProps {
  mode: "create" | "edit";
  /** Wajib untuk mode edit */
  vendorId?: number;
}

export function PenyelenggaraForm({ mode, vendorId }: PenyelenggaraFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !vendorId) return;

    const controller = new AbortController();

    getVendor(vendorId, controller.signal)
      .then((vendor) => {
        setValues({
          name: vendor.name,
          classification: vendor.classification ?? "",
          phone: vendor.phone ?? "",
          email: vendor.email ?? "",
          website: vendor.website ?? "",
          city: vendor.city ?? "",
          address: vendor.address ?? "",
          pic_name: vendor.pic_name ?? "",
          pic_phone: vendor.pic_phone ?? "",
          pic_email: vendor.pic_email ?? "",
          pic_position: vendor.pic_position ?? "",
          status: vendor.status,
        });
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setFormError(
          err instanceof ApiError && err.status === 404
            ? "Penyelenggara tidak ditemukan."
            : err instanceof Error
              ? err.message
              : "Gagal memuat data penyelenggara.",
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [isEdit, vendorId]);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.classification) return;

    const payload: VendorPayload = {
      name: values.name.trim(),
      classification: values.classification,
      phone: orNull(values.phone),
      email: orNull(values.email),
      website: orNull(values.website),
      city: orNull(values.city),
      address: orNull(values.address),
      pic_name: orNull(values.pic_name),
      pic_phone: orNull(values.pic_phone),
      pic_email: orNull(values.pic_email),
      pic_position: orNull(values.pic_position),
      status: values.status,
    };

    setSaving(true);
    setErrors({});
    setFormError(null);

    try {
      if (isEdit && vendorId) {
        await updateVendor(vendorId, payload);
      } else {
        await createVendor(payload);
      }

      router.push("/penyelenggara-pelatihan");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const fieldErrors: FieldErrors = {};

        for (const [field, messages] of Object.entries(err.errors)) {
          if (field in emptyForm) {
            fieldErrors[field as keyof FormValues] = messages[0];
          }
        }

        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0) setFormError(err.message);
      } else {
        setFormError(
          err instanceof Error ? err.message : "Gagal menyimpan data penyelenggara.",
        );
      }

      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Data Penyelenggara", href: "/penyelenggara-pelatihan" },
          { label: isEdit ? "Edit Penyelenggara" : "Tambah Penyelenggara" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Link
          href="/penyelenggara-pelatihan"
          aria-label="Kembali ke daftar penyelenggara"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit
              ? "Edit Penyelenggara Pelatihan"
              : "Tambah Penyelenggara Pelatihan Baru"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lengkapi Identitas Penyelenggara Pelatihan
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
          Memuat data penyelenggara...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ---------- Informasi Penyelenggara ---------- */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Informasi Penyelenggara
            </h2>

            <div className="space-y-5">
              <FormField label="Nama Penyelenggara" required error={errors.name}>
                <input
                  type="text"
                  required
                  disabled={saving}
                  value={values.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Cth. PT. MarkPlus Indonesia"
                  className={`${formInputClass} disabled:opacity-60`}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label="Jenis Penyelenggara"
                  required
                  error={errors.classification}
                >
                  <select
                    required
                    disabled={saving}
                    value={values.classification}
                    onChange={(e) =>
                      setField("classification", e.target.value as VendorType)
                    }
                    className={`${formInputClass} disabled:opacity-60`}
                  >
                    <option value="" disabled>
                      Pilih...
                    </option>
                    {(Object.keys(VENDOR_TYPE_LABEL) as VendorType[]).map((key) => (
                      <option key={key} value={key}>
                        {VENDOR_TYPE_LABEL[key]}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Status" error={errors.status}>
                  <select
                    disabled={saving}
                    value={values.status ? "1" : "0"}
                    onChange={(e) => setField("status", e.target.value === "1")}
                    className={`${formInputClass} disabled:opacity-60`}
                  >
                    <option value="1">Aktif</option>
                    <option value="0">Non-aktif</option>
                  </select>
                </FormField>

                <FormField label="Nomor Telpon" error={errors.phone}>
                  <input
                    type="text"
                    disabled={saving}
                    value={values.phone ?? ""}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={`${formInputClass} disabled:opacity-60`}
                  />
                </FormField>

                <FormField label="E-Mail" error={errors.email}>
                  <input
                    type="email"
                    disabled={saving}
                    value={values.email ?? ""}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="markpxxxx@gmxx.com"
                    className={`${formInputClass} disabled:opacity-60`}
                  />
                </FormField>

                <FormField label="Kota" error={errors.city}>
                  <input
                    type="text"
                    disabled={saving}
                    value={values.city ?? ""}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder="Cth. Jakarta"
                    className={`${formInputClass} disabled:opacity-60`}
                  />
                </FormField>

                <FormField label="Website" error={errors.website}>
                  <input
                    type="text"
                    disabled={saving}
                    value={values.website ?? ""}
                    onChange={(e) => setField("website", e.target.value)}
                    placeholder="https://markplus.com"
                    className={`${formInputClass} disabled:opacity-60`}
                  />
                </FormField>
              </div>

              <FormField label="Alamat" error={errors.address}>
                <textarea
                  rows={3}
                  disabled={saving}
                  value={values.address ?? ""}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Alamat lengkap kantor penyelenggara"
                  className={`${formInputClass} disabled:opacity-60`}
                />
              </FormField>
            </div>
          </div>

          {/* ---------- Informasi PIC ---------- */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-900">Informasi PIC</h2>

            <div className="space-y-5">
              <FormField label="Nama PIC" error={errors.pic_name}>
                <input
                  type="text"
                  disabled={saving}
                  value={values.pic_name ?? ""}
                  onChange={(e) => setField("pic_name", e.target.value)}
                  placeholder="Cth. Budi Santoso"
                  className={`${formInputClass} disabled:opacity-60`}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Nomor Telpon PIC" error={errors.pic_phone}>
                  <input
                    type="text"
                    disabled={saving}
                    value={values.pic_phone ?? ""}
                    onChange={(e) => setField("pic_phone", e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={`${formInputClass} disabled:opacity-60`}
                  />
                </FormField>

                <FormField label="E-Mail PIC" error={errors.pic_email}>
                  <input
                    type="email"
                    disabled={saving}
                    value={values.pic_email ?? ""}
                    onChange={(e) => setField("pic_email", e.target.value)}
                    placeholder="markpxxxx@gmxx.com"
                    className={`${formInputClass} disabled:opacity-60`}
                  />
                </FormField>
              </div>

              <FormField label="Jabatan PIC" error={errors.pic_position}>
                <input
                  type="text"
                  disabled={saving}
                  value={values.pic_position ?? ""}
                  onChange={(e) => setField("pic_position", e.target.value)}
                  placeholder="Cth. Sales and Marketing"
                  className={`${formInputClass} disabled:opacity-60`}
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link
              href="/penyelenggara-pelatihan"
              className="flex items-center justify-center rounded-xl bg-slate-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Penyelenggara"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
