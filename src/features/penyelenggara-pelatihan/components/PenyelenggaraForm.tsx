"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormField, formInputClass } from "@/components/shared/FormField";
import { ApiError } from "@/lib/api-client";
import {
  createOrganizer,
  getOrganizer,
  ORGANIZER_TYPE_LABEL,
  updateOrganizer,
  type OrganizerPayload,
  type OrganizerStatus,
  type OrganizerType,
} from "../api/organizer";

interface FormValues {
  nama: string;
  tipe: OrganizerType | "";
  status: OrganizerStatus;
  telepon: string;
  email: string;
  website: string;
  kota: string;
  alamat: string;
  picNama: string;
  picTelepon: string;
  picEmail: string;
  picJabatan: string;
}

const emptyForm: FormValues = {
  nama: "",
  tipe: "",
  status: "ACTIVE",
  telepon: "",
  email: "",
  website: "",
  kota: "",
  alamat: "",
  picNama: "",
  picTelepon: "",
  picEmail: "",
  picJabatan: "",
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

// nama field backend -> field form
const FIELD_MAP: Record<string, keyof FormValues> = {
  name: "nama",
  type: "tipe",
  status: "status",
  phone: "telepon",
  email: "email",
  website: "website",
  city: "kota",
  address: "alamat",
  pic_name: "picNama",
  pic_phone: "picTelepon",
  pic_email: "picEmail",
  pic_position: "picJabatan",
};

const orNull = (value: string) => (value.trim() === "" ? null : value.trim());

interface PenyelenggaraFormProps {
  mode: "create" | "edit";
  /** Wajib untuk mode edit */
  organizerId?: string;
}

export function PenyelenggaraForm({
  mode,
  organizerId,
}: PenyelenggaraFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !organizerId) return;

    const controller = new AbortController();
    getOrganizer(organizerId, controller.signal)
      .then((o) => {
        setValues({
          nama: o.nama,
          tipe: o.tipe,
          status: o.status,
          telepon: o.telepon ?? "",
          email: o.email ?? "",
          website: o.website ?? "",
          kota: o.kota ?? "",
          alamat: o.alamat ?? "",
          picNama: o.picNama ?? "",
          picTelepon: o.picTelepon ?? "",
          picEmail: o.picEmail ?? "",
          picJabatan: o.picJabatan ?? "",
        });
        setLoading(false);
      })
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setFormError(
          e instanceof ApiError && e.status === 404
            ? "Penyelenggara tidak ditemukan."
            : e.message,
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [isEdit, organizerId]);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.tipe) return;

    const payload: OrganizerPayload = {
      name: values.nama.trim(),
      type: values.tipe,
      status: values.status,
      phone: orNull(values.telepon),
      email: orNull(values.email),
      website: orNull(values.website),
      city: orNull(values.kota),
      address: orNull(values.alamat),
      pic_name: orNull(values.picNama),
      pic_phone: orNull(values.picTelepon),
      pic_email: orNull(values.picEmail),
      pic_position: orNull(values.picJabatan),
    };

    setSaving(true);
    setErrors({});
    setFormError(null);

    try {
      if (isEdit && organizerId) {
        await updateOrganizer(organizerId, payload);
      } else {
        await createOrganizer(payload);
      }
      router.push("/penyelenggara-pelatihan");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const fieldErrors: FieldErrors = {};
        Object.entries(err.errors).forEach(([field, messages]) => {
          const key = FIELD_MAP[field];
          if (key) fieldErrors[key] = messages[0];
        });
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0) setFormError(err.message);
      } else {
        setFormError((err as Error).message);
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
              <FormField label="Nama Penyelenggara" required error={errors.nama}>
                <input
                  type="text"
                  required
                  value={values.nama}
                  onChange={(e) => setField("nama", e.target.value)}
                  placeholder="Cth. PT. MarkPlus Indonesia"
                  className={formInputClass}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Jenis Penyelenggara" required error={errors.tipe}>
                  <select
                    required
                    value={values.tipe}
                    onChange={(e) =>
                      setField("tipe", e.target.value as OrganizerType)
                    }
                    className={formInputClass}
                  >
                    <option value="" disabled>
                      Pilih...
                    </option>
                    {(
                      Object.keys(ORGANIZER_TYPE_LABEL) as OrganizerType[]
                    ).map((key) => (
                      <option key={key} value={key}>
                        {ORGANIZER_TYPE_LABEL[key]}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Status" required error={errors.status}>
                  <select
                    value={values.status}
                    onChange={(e) =>
                      setField("status", e.target.value as OrganizerStatus)
                    }
                    className={formInputClass}
                  >
                    <option value="ACTIVE">Aktif</option>
                    <option value="INACTIVE">Non-aktif</option>
                  </select>
                </FormField>

                <FormField label="Nomor Telpon" error={errors.telepon}>
                  <input
                    type="text"
                    value={values.telepon}
                    onChange={(e) => setField("telepon", e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={formInputClass}
                  />
                </FormField>

                <FormField label="E-Mail" error={errors.email}>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="markpxxxx@gmxx.com"
                    className={formInputClass}
                  />
                </FormField>

                <FormField label="Kota" error={errors.kota}>
                  <input
                    type="text"
                    value={values.kota}
                    onChange={(e) => setField("kota", e.target.value)}
                    placeholder="Cth. Jakarta"
                    className={formInputClass}
                  />
                </FormField>

                <FormField label="Website" error={errors.website}>
                  <input
                    type="text"
                    value={values.website}
                    onChange={(e) => setField("website", e.target.value)}
                    placeholder="https://markplus.com"
                    className={formInputClass}
                  />
                </FormField>
              </div>

              <FormField label="Alamat" error={errors.alamat}>
                <textarea
                  rows={3}
                  value={values.alamat}
                  onChange={(e) => setField("alamat", e.target.value)}
                  placeholder="Alamat lengkap kantor penyelenggara"
                  className={formInputClass}
                />
              </FormField>
            </div>
          </div>

          {/* ---------- Informasi PIC ---------- */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Informasi PIC
            </h2>

            <div className="space-y-5">
              <FormField label="Nama PIC" error={errors.picNama}>
                <input
                  type="text"
                  value={values.picNama}
                  onChange={(e) => setField("picNama", e.target.value)}
                  placeholder="Cth. Budi Santoso"
                  className={formInputClass}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Nomor Telpon PIC" error={errors.picTelepon}>
                  <input
                    type="text"
                    value={values.picTelepon}
                    onChange={(e) => setField("picTelepon", e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={formInputClass}
                  />
                </FormField>

                <FormField label="E-Mail PIC" error={errors.picEmail}>
                  <input
                    type="email"
                    value={values.picEmail}
                    onChange={(e) => setField("picEmail", e.target.value)}
                    placeholder="markpxxxx@gmxx.com"
                    className={formInputClass}
                  />
                </FormField>
              </div>

              <FormField label="Jabatan PIC" error={errors.picJabatan}>
                <input
                  type="text"
                  value={values.picJabatan}
                  onChange={(e) => setField("picJabatan", e.target.value)}
                  placeholder="Cth. Sales & Marketing"
                  className={formInputClass}
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link
              href="/penyelenggara-pelatihan"
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
                  : "Simpan Penyelenggara"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
