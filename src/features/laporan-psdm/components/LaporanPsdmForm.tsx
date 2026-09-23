"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, Table2 } from "lucide-react";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import {
  Badge,
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  StaticValue,
  TabBar,
  Textarea,
  type TabItem,
} from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { useFormValues } from "@/hooks/useFormValues";
import { formatNumber } from "@/lib/format";
import { notBefore, requireText, requireSelection } from "@/lib/validation";
import { getTraining } from "@/features/program-pelatihan/api/pelatihan";
import { PesertaBiayaTable } from "./PesertaBiayaTable";
import { PilihKaryawanTable } from "./PilihKaryawanTable";
import { UnggahPesertaExcel } from "./UnggahPesertaExcel";
import { createTrainingRealization, getTrainingRealizationForEdit, updateTrainingRealization } from "../api/laporan";
import {
  ALOKASI_BIAYA_OPTIONS,
  needsLocation,
  emptyLaporanForm,
  countDays,
  KATEGORI_BIAYA_OPTIONS,
  METODE_OPTIONS,
  toNumber,
  type BiayaPesertaField,
  type LaporanFormValues,
  type Peserta,
} from "../model/laporan";

// Nama field di backend berbeda dengan key form, jadi error 422 perlu dipetakan.
const FIELD_MAP = {
  learning_method: "metode",
  learning_city: "kota",
  learning_location: "alamat",
  start_date: "tanggalMulai",
  end_date: "tanggalAkhir",
  financing_category: "kategoriBiaya",
  cost_allocation: "alokasiBiaya",
} as const;

/** Dua cara memilih peserta di bagian "Karyawan Peserta Pelatihan". */
type CaraPilihPeserta = "tabel" | "excel";

const PESERTA_TABS: TabItem<CaraPilihPeserta>[] = [
  { value: "tabel", label: "Pilih dari Tabel Karyawan", icon: Table2 },
  { value: "excel", label: "Unggah Excel", icon: FileSpreadsheet },
];

interface LaporanPsdmFormProps {
  /** Mode tambah: laporan baru untuk pelatihan ini */
  trainingId?: string;
  /** Mode ubah: id laporan yang diedit */
  laporanId?: string;
}

/**
 * Form tambah/ubah laporan realisasi pengembangan SDM.
 *
 * Urutan isinya mengikuti mockup:
 * 1. Rincian Pelatihan        — hanya tampil, dari program pelatihan
 * 2. Waktu & Lokasi Pelatihan
 * 3. Durasi Pelatihan         — jam/hari, sama untuk semua peserta
 * 4. Biaya Pelatihan          — biaya per peserta
 * 5. Karyawan Peserta         — centang karyawan dari direktori
 * 6. Informasi Peserta & Alokasi Biaya Riil — biaya perjalanan dinas per peserta
 */
export default function LaporanPsdmForm({ trainingId, laporanId }: LaporanPsdmFormProps) {
  const router = useRouter();
  const isEdit = Boolean(laporanId);
  const [pesertaTab, setPesertaTab] = useState<CaraPilihPeserta>("tabel");

  // Mode ubah: muat laporannya dulu, id pelatihannya ikut dari situ.
  const laporan = useAsyncData((signal) => getTrainingRealizationForEdit(laporanId as string, signal), {
    deps: [laporanId],
    enabled: isEdit,
  });

  const idPelatihan = trainingId ?? laporan.data?.trainingId;

  const pelatihan = useAsyncData((signal) => getTraining(idPelatihan as string, signal), {
    deps: [idPelatihan],
    enabled: Boolean(idPelatihan),
  });

  const [values, setValues] = useFormValues(
    laporan.data,
    (data) => data.form,
    emptyLaporanForm,
  );

  const kembaliKe = idPelatihan ? `/dashboard/laporan-psdm/pelatihan/${idPelatihan}` : "/dashboard/laporan-psdm";

  const { submit, saving, errors, formError } = useFormSubmit<LaporanFormValues>({
    fieldMap: FIELD_MAP,
    // Peserta tidak dicek di sini: tombol Simpan sudah mati selama belum ada
    // karyawan yang dipilih (lihat `alasanTidakBisaSimpan`).
    validate: (form) => ({
      tanggalMulai: requireText(form.tanggalMulai, "Tanggal Mulai"),
      tanggalAkhir:
        requireText(form.tanggalAkhir, "Tanggal Akhir") ??
        notBefore(form.tanggalAkhir, "Tanggal Akhir", form.tanggalMulai, "Tanggal Mulai"),
      metode: requireSelection(form.metode, "Metode Pelatihan"),
      jamExperiential: requireText(form.jamExperiential, "Experiential Learning"),
      jamSocial: requireText(form.jamSocial, "Social Learning"),
      jamFormal: requireText(form.jamFormal, "Formal Learning"),
      kategoriBiaya: requireSelection(form.kategoriBiaya, "Kategori Biaya"),
      alokasiBiaya: requireSelection(form.alokasiBiaya, "Alokasi Biaya"),
      biayaPelatihan: requireText(form.biayaPelatihan, "Biaya Pelatihan"),
    }),
    onSubmit: async (form) => {
      if (!idPelatihan) return;

      if (laporanId) {
        await updateTrainingRealization(laporanId, idPelatihan, form);
      } else {
        await createTrainingRealization(idPelatihan, form);
      }

      router.push(kembaliKe);
    },
  });

  // --- Pengubah isian --------------------------------------------------------
  // Dibungkus useCallback supaya identitasnya tetap: tabel peserta memakai
  // fungsi ini di kolomnya, dan kotak isian biaya tidak boleh kehilangan fokus.

  const setField = useCallback(
    <K extends keyof LaporanFormValues>(key: K, value: LaporanFormValues[K]) =>
      setValues((prev) => ({ ...prev, [key]: value })),
    [setValues],
  );

  const changeParticipants = useCallback(
    (peserta: Peserta[]) => setValues((prev) => ({ ...prev, peserta })),
    [setValues],
  );

  const changeParticipantCost = useCallback(
    (pegawaiId: string, field: BiayaPesertaField, nilai: number) =>
      setValues((prev) => ({
        ...prev,
        peserta: prev.peserta.map((item) =>
          item.pegawaiId === pegawaiId ? { ...item, [field]: nilai } : item,
        ),
      })),
    [setValues],
  );

  const removeParticipant = useCallback(
    (pegawaiId: string) =>
      setValues((prev) => ({
        ...prev,
        peserta: prev.peserta.filter((item) => item.pegawaiId !== pegawaiId),
      })),
    [setValues],
  );

  // --- Nilai turunan untuk ditampilkan ----------------------------------------

  const hari = countDays(values.tanggalMulai, values.tanggalAkhir);
  const jamPerHari =
    toNumber(values.jamExperiential) + toNumber(values.jamSocial) + toNumber(values.jamFormal);
  const data = pelatihan.data;
  // Selama belum ada peserta, tombol Simpan dimatikan dengan alasan ini.
  const alasanTidakBisaSimpan =
    values.peserta.length === 0 ? "Pilih minimal satu karyawan peserta untuk menyimpan." : null;
  const judul = isEdit
    ? "Ubah Laporan Realisasi Pengembangan SDM"
    : "Tambah Laporan Realisasi Pengembangan SDM";

  return (
    <FormPageLayout
      variant="plain"
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Laporan Realisasi PSDM", href: "/dashboard/laporan-psdm" },
        { label: data?.nama ?? "Pelatihan", href: kembaliKe },
        { label: isEdit ? "Ubah Laporan" : "Tambah Laporan" },
      ]}
      title={judul}
      description="Lengkapi Data Laporan Realisasi Pengembangan SDM"
      backHref={kembaliKe}
      loading={laporan.loading || pelatihan.loading}
      loadingLabel="Memuat data laporan..."
      error={formError ?? laporan.error ?? pelatihan.error}
      saving={saving}
      submitLabel={isEdit ? "Simpan Perubahan" : "Simpan Laporan"}
      submitDisabledReason={alasanTidakBisaSimpan}
      onSubmit={() => submit(values)}
    >
      {/* 1. Rincian Pelatihan ------------------------------------------------ */}
      <Card padding="roomy">
        <CardHeader
          title="Rincian Pelatihan"
          description="Terisi otomatis dari program pelatihan yang dilaporkan"
        />

        <div className="mt-5 space-y-5">
          <Field label="Nama Pelatihan">
            <StaticValue>{data?.nama}</StaticValue>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Penyelenggara Pelatihan">
              <StaticValue>{data?.penyelenggara}</StaticValue>
            </Field>
            <Field label="Jenis Pengembangan SDM">
              <StaticValue>{data?.jenisPsdmLabel}</StaticValue>
            </Field>
            <Field label="Jenis Kompetensi">
              <StaticValue>{data?.jenisKompetensiLabel}</StaticValue>
            </Field>
            <Field label="Bidang">
              <StaticValue>{data?.bidangLabel}</StaticValue>
            </Field>
          </div>

          <Field label="Deskripsi Pelatihan">
            <StaticValue>{data?.deskripsi}</StaticValue>
          </Field>
        </div>
      </Card>

      {/* 2. Waktu & Lokasi Pelatihan ---------------------------------------- */}
      <Card padding="roomy">
        <CardHeader title="Waktu & Lokasi Pelatihan" description="Waktu dan lokasi pelatihan yang dilaksanakan" />

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Tanggal Mulai" required error={errors.tanggalMulai}>
              <Input
                type="date"
                value={values.tanggalMulai}
                invalid={Boolean(errors.tanggalMulai)}
                disabled={saving}
                onChange={(event) => setField("tanggalMulai", event.target.value)}
              />
            </Field>

            <Field
              label="Tanggal Akhir"
              required
              error={errors.tanggalAkhir}
              hint={hari > 0 ? `Durasi pelatihan ${hari} hari` : undefined}
            >
              <Input
                type="date"
                value={values.tanggalAkhir}
                min={values.tanggalMulai || undefined}
                invalid={Boolean(errors.tanggalAkhir)}
                disabled={saving}
                onChange={(event) => setField("tanggalAkhir", event.target.value)}
              />
            </Field>
          </div>

          <Field label="Metode Pelatihan" required error={errors.metode}>
            <Select
              value={values.metode}
              invalid={Boolean(errors.metode)}
              disabled={saving}
              placeholder="Pilih..."
              options={METODE_OPTIONS}
              onChange={(event) => setField("metode", event.target.value)}
            />
          </Field>

          {/* Lokasi hanya untuk pelatihan yang ada tatap mukanya */}
          {needsLocation(values.metode) && (
            <>
              <Field label="Kota Pelatihan" error={errors.kota}>
                <Input
                  value={values.kota}
                  invalid={Boolean(errors.kota)}
                  disabled={saving}
                  placeholder="Cth. Jakarta Selatan"
                  onChange={(event) => setField("kota", event.target.value)}
                />
              </Field>

              <Field label="Lokasi Pelatihan (Alamat)" error={errors.alamat}>
                <Textarea
                  value={values.alamat}
                  invalid={Boolean(errors.alamat)}
                  disabled={saving}
                  placeholder="Cth. Hotel Gran Melia Jakarta, Jl. H. R. Rasuna Said Kav. X-0, Kuningan Timur, Setiabudi"
                  onChange={(event) => setField("alamat", event.target.value)}
                />
              </Field>
            </>
          )}
        </div>
      </Card>

      {/* 3. Durasi Pelatihan -------------------------------------------------- */}
      <Card padding="roomy">
        <CardHeader
          title="Durasi Pelatihan"
          description="Durasi pembelajaran dalam jam per hari (jam/hari), berlaku untuk semua peserta"
        />

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field
            label="Experiential Learning"
            required
            error={errors.jamExperiential}
            hint="On the job, praktek langsung, action learning."
          >
            <Input
              type="number"
              min={0}
              value={values.jamExperiential}
              invalid={Boolean(errors.jamExperiential)}
              disabled={saving}
              placeholder="Jam/Hari"
              onChange={(event) => setField("jamExperiential", event.target.value)}
            />
          </Field>

          <Field
            label="Social Learning"
            required
            error={errors.jamSocial}
            hint="Mentoring, diskusi kelompok, peer review."
          >
            <Input
              type="number"
              min={0}
              value={values.jamSocial}
              invalid={Boolean(errors.jamSocial)}
              disabled={saving}
              placeholder="Jam/Hari"
              onChange={(event) => setField("jamSocial", event.target.value)}
            />
          </Field>

          <Field
            label="Formal Learning"
            required
            error={errors.jamFormal}
            hint="Presentasi materi, workshop kurikulum, tes."
          >
            <Input
              type="number"
              min={0}
              value={values.jamFormal}
              invalid={Boolean(errors.jamFormal)}
              disabled={saving}
              placeholder="Jam/Hari"
              onChange={(event) => setField("jamFormal", event.target.value)}
            />
          </Field>
        </div>

        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Total jam per peserta:{" "}
          <span className="font-semibold text-slate-800">
            {jamPerHari} jam/hari × {hari} hari = {formatNumber(jamPerHari * hari)} jam
          </span>
        </p>
      </Card>

      {/* 4. Biaya Pelatihan --------------------------------------------------- */}
      <Card padding="roomy">
        <CardHeader
          title="Biaya Pelatihan"
          description="Rincian pembiayaan pelatihan dan alokasi anggaran"
        />

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Kategori Biaya" required error={errors.kategoriBiaya}>
              <Select
                value={values.kategoriBiaya}
                invalid={Boolean(errors.kategoriBiaya)}
                disabled={saving}
                placeholder="Pilih..."
                options={KATEGORI_BIAYA_OPTIONS}
                onChange={(event) => setField("kategoriBiaya", event.target.value)}
              />
            </Field>

            <Field label="Alokasi Biaya" required error={errors.alokasiBiaya}>
              <Select
                value={values.alokasiBiaya}
                invalid={Boolean(errors.alokasiBiaya)}
                disabled={saving}
                placeholder="Pilih..."
                options={ALOKASI_BIAYA_OPTIONS}
                onChange={(event) => setField("alokasiBiaya", event.target.value)}
              />
            </Field>
          </div>

          <Field
            label="Biaya Pelatihan per Peserta (Rp)"
            required
            error={errors.biayaPelatihan}
            hint="Berlaku sama untuk setiap peserta yang dipilih"
          >
            <Input
              type="number"
              min={0}
              value={values.biayaPelatihan}
              invalid={Boolean(errors.biayaPelatihan)}
              disabled={saving}
              placeholder="Cth. 7500000"
              onChange={(event) => setField("biayaPelatihan", event.target.value)}
            />
          </Field>
        </div>
      </Card>

      {/* 5. Karyawan Peserta Pelatihan --------------------------------------- */}
      <Card padding="roomy">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              Karyawan Peserta Pelatihan
              <Badge tone="emerald">{values.peserta.length} Dipilih</Badge>
            </span>
          }
          description="Pilih karyawan dari tabel atau unggah daftar dari Excel. Pilihan tetap tersimpan saat berpindah tab, halaman, atau pencarian."
          action={<TabBar tabs={PESERTA_TABS} value={pesertaTab} onChange={setPesertaTab} />}
        />

        {/* Kedua tab selalu terpasang; yang tidak aktif hanya disembunyikan
            (`hidden`). Dengan begitu halaman, filter, dan pencarian tabel
            karyawan tidak ter-reset saat berpindah tab. */}
        <div className="mt-5" hidden={pesertaTab !== "tabel"}>
          <PilihKaryawanTable
            peserta={values.peserta}
            onChange={changeParticipants}
            disabled={saving}
          />
        </div>

        <div className="mt-5" hidden={pesertaTab !== "excel"}>
          <UnggahPesertaExcel />
        </div>
      </Card>

      {/* 6. Informasi Peserta & Alokasi Biaya Riil --------------------------- */}
      <Card padding="roomy">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              Informasi Peserta & Alokasi Biaya Riil
              <Badge tone="emerald">{values.peserta.length} Peserta Terpilih</Badge>
            </span>
          }
          description="Isi biaya perjalanan dinas (transport, per diem, penginapan) untuk tiap peserta"
        />

        <div className="mt-5">
          <PesertaBiayaTable
            peserta={values.peserta}
            biayaPelatihan={toNumber(values.biayaPelatihan)}
            onCostChange={changeParticipantCost}
            onRemove={removeParticipant}
            disabled={saving}
          />
        </div>
      </Card>
    </FormPageLayout>
  );
}
