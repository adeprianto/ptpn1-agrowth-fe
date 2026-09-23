"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { Alert, Button, ButtonLink } from "@/components/ui";

interface FormPageLayoutProps {
  breadcrumb: BreadcrumbItem[];
  title: string;
  description?: string;
  /** Tujuan tombol panah kembali dan tombol Batal */
  backHref: string;
  /** Tampilkan placeholder alih-alih form, mis. saat memuat data yang diedit */
  loading?: boolean;
  loadingLabel?: string;
  /** Error yang tidak menempel ke field mana pun */
  error?: string | null;
  saving?: boolean;
  submitLabel: string;
  /**
   * Isi untuk mematikan tombol Simpan; teksnya tampil di samping tombol
   * sebagai alasan, mis. "Pilih minimal satu karyawan peserta".
   */
  submitDisabledReason?: string | null;
  cancelLabel?: string;
  /**
   * "card" (bawaan) membungkus isi form dalam satu kartu putih.
   * "plain" tidak membungkus apa pun — untuk form panjang yang isinya sudah
   * dipecah sendiri jadi beberapa `Card`.
   */
  variant?: "card" | "plain";
  onSubmit: () => void;
  /** Isi form — susun dengan `Field` dan kontrol dari `@/components/ui` */
  children: ReactNode;
}

/**
 * Kerangka halaman form: breadcrumb, judul dengan tombol kembali, kotak
 * pesan error, kartu form, dan tombol Batal/Simpan di bawahnya.
 *
 * @example
 * <FormPageLayout
 *   breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Unit" }]}
 *   title="Tambah Unit"
 *   backHref="/organisasi/unit"
 *   error={formError}
 *   saving={saving}
 *   submitLabel="Simpan Unit"
 *   onSubmit={() => submit(values)}
 * >
 *   <Field label="Nama Unit" required error={errors.nama}>
 *     <Input value={values.nama} onChange={onChangeNama} />
 *   </Field>
 * </FormPageLayout>
 */
export function FormPageLayout({
  breadcrumb,
  title,
  description,
  backHref,
  loading = false,
  loadingLabel = "Memuat data...",
  error,
  saving = false,
  submitLabel,
  submitDisabledReason,
  cancelLabel = "Batal",
  variant = "card",
  onSubmit,
  children,
}: FormPageLayoutProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={breadcrumb} />

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href={backHref}
          aria-label="Kembali"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400 sm:p-10">
          {loadingLabel}
        </div>
      ) : (
        // noValidate: validasi bawaan browser dimatikan, semua pengecekan lewat
        // `validate` di useFormSubmit supaya pesan errornya seragam
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          {variant === "card" ? (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              {children}
            </div>
          ) : (
            children
          )}

          {/* Di ponsel tombolnya ditumpuk selebar layar — sepasang tombol
              kecil di pojok kanan sulit dijangkau ibu jari. Simpan ditaruh
              paling atas karena itu aksi utamanya. */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            {submitDisabledReason && (
              <p className="text-center text-sm text-slate-500 sm:mr-2 sm:text-right">
                {submitDisabledReason}
              </p>
            )}
            <ButtonLink
              href={backHref}
              variant="secondary"
              size="lg"
              className="w-full justify-center sm:w-auto"
            >
              {cancelLabel}
            </ButtonLink>
            <Button
              type="submit"
              size="lg"
              loading={saving}
              disabled={Boolean(submitDisabledReason)}
              className="w-full justify-center sm:w-auto"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
