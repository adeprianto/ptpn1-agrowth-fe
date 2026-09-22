"use client";

import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import FormFieldFile from "@/components/shared/FormFieldFile";
import {
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  StaticValue,
  Textarea,
} from "@/components/ui";

// DUMMY — rincian pelatihan diambil dari program yang dipilih sebelumnya.
const rincianPelatihan = {
  nama: 'Financial Talk "Launching Financial Guidebook & Talkshow Individual Tax"',
  penyelenggara: "Executive Strategic Management for Plantation",
  jenisPsdm: "Pengembangan BOD/BOC",
  jenisKompetensi: "Hard Competency",
  bidang: "Operational",
  alokasiPembiayaan: "PSDM - Pengembangan BOD & BOC",
  deskripsi:
    "Pengembangan wawasan strategis dan pengambilan keputusan untuk optimalisasi aset oleh jajaran Direksi dan Komisaris.",
};

const METODE_OPTIONS = [
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

const ALAMAT_PLACEHOLDER =
  "Cth. Jl. H. R. Rasuna Said, RT.7/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950";

export default function LaporanPsdmForm() {
  const router = useRouter();

  function handleSubmit() {
    // DUMMY — endpoint laporan realisasi PSDM belum tersedia.
    // TODO: POST /api/v1/laporan-psdm
    router.push("/laporan-psdm");
  }

  return (
    <FormPageLayout
      variant="plain"
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: "Laporan Realisasi Pengembangan SDM",
          href: "/laporan-psdm",
        },
        { label: "Tambah Laporan Realisasi PSDM" },
      ]}
      title="Tambah Laporan Realisasi Pengembangan SDM"
      description="Lengkapi Data Laporan Realisasi Pengembangan SDM"
      backHref="/laporan-psdm"
      submitLabel="Simpan Laporan"
      onSubmit={handleSubmit}
    >
      <Card className="p-6">
        <CardHeader
          title="Rincian Pelatihan"
          description="Terisi otomatis dari program pelatihan yang dilaporkan"
        />

        <div className="mt-5 space-y-5">
          <Field label="Nama Pelatihan">
            <StaticValue>{rincianPelatihan.nama}</StaticValue>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Penyelenggara Pelatihan">
              <StaticValue>{rincianPelatihan.penyelenggara}</StaticValue>
            </Field>

            <Field label="Jenis Pengembangan SDM">
              <StaticValue>{rincianPelatihan.jenisPsdm}</StaticValue>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Jenis Kompetensi">
              <StaticValue>{rincianPelatihan.jenisKompetensi}</StaticValue>
            </Field>

            <Field label="Bidang">
              <StaticValue>{rincianPelatihan.bidang}</StaticValue>
            </Field>

            <Field label="Alokasi Pembiayaan Pelatihan">
              <StaticValue>{rincianPelatihan.alokasiPembiayaan}</StaticValue>
            </Field>
          </div>

          <Field label="Deskripsi Pelatihan">
            <StaticValue>{rincianPelatihan.deskripsi}</StaticValue>
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader title="Waktu & Lokasi Pelatihan" />

        <div className="mt-5 space-y-5">
          <Field label="Nama PIC" required>
            <Input required placeholder="Cth. PT. MarkPlus Indonesia" />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Tanggal Mulai" required>
              <Input type="date" required />
            </Field>

            <Field label="Tanggal Akhir" required>
              <Input type="date" required />
            </Field>

            <Field label="Metode Pelatihan" required>
              <Select
                required
                defaultValue=""
                placeholder="Pilih..."
                options={METODE_OPTIONS}
              />
            </Field>

            <Field label="Lokasi Pelatihan" required>
              <Input required placeholder="Cth. Kota Jakarta" />
            </Field>
          </div>

          <Field label="Alamat Lokasi Pelatihan">
            <Textarea placeholder={ALAMAT_PLACEHOLDER} />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader
          title="Durasi Pelatihan"
          description="Durasi pembelajaran dalam jam per hari (jam/hari)"
        />

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field
            label="Experiental Learning"
            hint="On the job, praktek langsung, action learning."
            required
          >
            <Input type="number" min={0} required placeholder="Jam/Hari" />
          </Field>

          <Field
            label="Social Learning"
            hint="Mentoring, diskusi kelompok, peer review."
            required
          >
            <Input type="number" min={0} required placeholder="Jam/Hari" />
          </Field>

          <Field
            label="Formal Learning"
            hint="Presentasi materi, workshop kurikulum, tes."
            required
          >
            <Input type="number" min={0} required placeholder="Jam/Hari" />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader title="Biaya Pelatihan" />

        <div className="mt-5">
          <Field label="Biaya Pelatihan" required>
            <Input type="number" min={0} required placeholder="Rp" />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader
          title="Biaya Perjalanan Dinas"
          description="Total BPD dihitung otomatis dari ketiga komponen di bawah"
        />

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Biaya Transport">
              <Input type="number" min={0} placeholder="Rp" />
            </Field>

            <Field label="Biaya Per Diem">
              <Input type="number" min={0} placeholder="Rp" />
            </Field>

            <Field label="Biaya Penginapan">
              <Input type="number" min={0} placeholder="Rp/Orang" />
            </Field>
          </div>

          <Field label="Total Biaya BPD">
            <StaticValue placeholder="Rp 0" />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader
          title="Total Biaya"
          description="Total biaya pelatihan + biaya perjalanan dinas"
        />

        <div className="mt-5">
          <StaticValue placeholder="Rp 0" />
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader title="Informasi Peserta" />

        <div className="mt-5">
          <FormFieldFile />
        </div>
      </Card>
    </FormPageLayout>
  );
}
