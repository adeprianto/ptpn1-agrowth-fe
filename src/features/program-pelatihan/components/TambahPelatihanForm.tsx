"use client";

import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import {
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  Textarea,
  type SelectOption,
} from "@/components/ui";

// DUMMY — daftar pilihan belum diambil dari master/API.
const PENYELENGGARA_OPTIONS: SelectOption[] = [
  { value: "1", label: "LPP Agro Nusantara" },
  { value: "2", label: "PT. MarkPlus Indonesia" },
  {
    value: "3",
    label: "Balai Besar Pelatihan Manajemen dan Kepemimpinan Pertanian",
  },
  { value: "4", label: "CV Solusi SDM Mandiri" },
];

const JENIS_PSDM_OPTIONS: SelectOption[] = [
  { value: "bod_boc", label: "Pengembangan BOD/BOC" },
  { value: "agrowallet", label: "Agrowallet" },
  { value: "iht", label: "In House Training" },
  { value: "public_training", label: "Public Training" },
  { value: "kursus_jabatan", label: "Kursus Jabatan" },
  { value: "benchmarking", label: "Benchmarking" },
  { value: "program_budaya", label: "Program Budaya" },
  { value: "sertifikasi", label: "Sertifikasi" },
];

const JENIS_KOMPETENSI_OPTIONS: SelectOption[] = [
  { value: "hard", label: "Hard Competency" },
  { value: "soft", label: "Soft Competency" },
  { value: "hard_soft", label: "Hard Competency & Soft Competency" },
];

const BIDANG_OPTIONS: SelectOption[] = [
  { value: "tanaman", label: "Tanaman" },
  { value: "pengolahan", label: "Pengolahan" },
  { value: "teknik", label: "Teknik" },
  { value: "keuangan", label: "Keuangan" },
  { value: "sdm", label: "SDM" },
  { value: "ti", label: "IT" },
  { value: "umum", label: "Umum" },
];

const ANGGARAN_OPTIONS: SelectOption[] = [
  { value: "psdm_bod_boc", label: "PSDM - Pengembangan BOD & BOC" },
  { value: "agrowallet", label: "PSDM - Agro Wallet" },
  { value: "iht_public_training", label: "PSDM - IHT dan Public Training" },
  { value: "pldp", label: "PSDM - Kursus Jabatan (PLDP)" },
  { value: "sertifikasi_jabatan", label: "PSDM - Sertifikasi Jabatan" },
  {
    value: "benchmarking",
    label: "PSDM - Program Study Banding (Benchmarking)",
  },
  { value: "pendidikan_lanjutan", label: "PSDM - Program Pendidikan Lanjutan" },
  { value: "assesment", label: "Assesment" },
  { value: "rekrutmen", label: "Rekrutmen" },
  { value: "onboarding", label: "Onboarding" },
  { value: "program_budaya_perusahaan", label: "Program Budaya Perusahaan" },
  {
    value: "konsultasi_pengembangan_sdm",
    label: "Konsultasi Pengembangan SDM",
  },
  { value: "inovasi_riset", label: "Inovasi dan Riset" },
];

export default function TambahPelatihanForm() {
  const router = useRouter();

  function handleSubmit() {
    // DUMMY — endpoint program pelatihan belum tersedia.
    // TODO: POST /api/v1/program-pelatihan
    router.push("/program-pelatihan");
  }

  return (
    <FormPageLayout
      variant="plain"
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Program Pelatihan", href: "/program-pelatihan" },
        { label: "Tambah Program Pelatihan" },
      ]}
      title="Tambah Program Pelatihan Baru"
      description="Lengkapi Data Program Pelatihan"
      backHref="/program-pelatihan"
      submitLabel="Simpan Pelatihan"
      onSubmit={handleSubmit}
    >
      <Card className="p-6">
        <CardHeader title="Data Pelatihan" />

        <div className="mt-5 space-y-5">
          <Field label="Nama Pelatihan" required>
            <Input
              required
              placeholder="Cth. Agribusiness Investment Management Series (AIMS)"
            />
          </Field>

          <Field label="Penyelenggara Pelatihan" required>
            <Select
              required
              defaultValue=""
              placeholder="Pilih..."
              options={PENYELENGGARA_OPTIONS}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Jenis Pengembangan SDM" required>
              <Select
                required
                defaultValue=""
                placeholder="Pilih..."
                options={JENIS_PSDM_OPTIONS}
              />
            </Field>

            <Field label="Jenis Kompetensi Pelatihan" required>
              <Select
                required
                defaultValue=""
                placeholder="Pilih..."
                options={JENIS_KOMPETENSI_OPTIONS}
              />
            </Field>

            <Field label="Bidang Pelatihan" required>
              <Select
                required
                defaultValue=""
                placeholder="Pilih..."
                options={BIDANG_OPTIONS}
              />
            </Field>

            <Field label="Alokasi Anggaran Pembiayaan" required>
              <Select
                required
                defaultValue=""
                placeholder="Pilih..."
                options={ANGGARAN_OPTIONS}
              />
            </Field>
          </div>

          <Field label="Deskripsi Pelatihan">
            <Textarea placeholder="Deskripsi mengenai pelatihan" />
          </Field>
        </div>
      </Card>
    </FormPageLayout>
  );
}
