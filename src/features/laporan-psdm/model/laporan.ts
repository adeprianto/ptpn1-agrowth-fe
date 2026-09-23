/**
 * Model laporan realisasi pengembangan SDM (PSDM).
 *
 * Isi file ini:
 * 1. Daftar pilihan dropdown (metode, kategori biaya, alokasi biaya)
 * 2. Bentuk data yang dipakai komponen (`Laporan`, `Peserta`, `LaporanFormValues`)
 * 3. Hitungan (jumlah hari, total biaya peserta)
 * 4. Pemetaan dari/ke bentuk backend (`toTrainingRealization`, `toTrainingRealizationPayload`, ...)
 *
 * Aturan penting dari backend: jam belajar dan biaya disimpan PER PESERTA.
 * Form mengisi jam/hari dan biaya pelatihan sekali untuk semua peserta,
 * sedangkan biaya perjalanan dinas (transport, per diem, penginapan) diisi
 * per peserta di tabel "Informasi Peserta & Alokasi Biaya Riil".
 */
import type { SelectOption } from "@/components/ui";
import type {
  TrainingRealizationDetailResource,
  TrainingRealizationPayload,
  TrainingRealizationResource,
  TrainingRealizationSummary,
} from "@/types/api/training-realization";
import { getPlacementRegional, type Pegawai } from "@/features/pegawai/model/pegawai";

/* -------------------------------------------------------------------------- */
/* 1. Pilihan dropdown                                                         */
/* -------------------------------------------------------------------------- */

export const METODE_OPTIONS: SelectOption[] = [
  { value: "offline", label: "Tatap Muka / Luring (Offline)" },
  { value: "online", label: "Daring (Online)" },
  { value: "hybrid", label: "Hybrid (Offline & Online)" },
];

// Backend menyimpan kategori & alokasi sebagai teks biasa, jadi nilai yang
// disimpan sama dengan labelnya. Tambah/ubah pilihannya cukup di sini.
export const KATEGORI_BIAYA_OPTIONS: SelectOption[] = [
  "PSDM - Agro Wallet",
  "PSDM - Pengembangan BOD & BOC",
  "PSDM - In House Training",
  "PSDM - Public Training",
  "PSDM - Sertifikasi",
].map((value) => ({ value, label: value }));

export const ALOKASI_BIAYA_OPTIONS: SelectOption[] = [
  "Head Office",
  "Regional",
  "Unit",
].map((value) => ({ value, label: value }));

/** Label metode untuk tabel, mis. "offline" -> "Tatap Muka / Luring (Offline)". */
export function methodLabel(metode: string): string {
  return METODE_OPTIONS.find((option) => option.value === metode)?.label ?? metode;
}

/** Kota & alamat hanya relevan kalau pelatihannya ada tatap muka. */
export function needsLocation(metode: string): boolean {
  return metode === "offline" || metode === "hybrid";
}

/* -------------------------------------------------------------------------- */
/* 2. Bentuk data untuk komponen                                               */
/* -------------------------------------------------------------------------- */

/** Satu baris di tabel daftar laporan milik sebuah pelatihan. */
export interface Laporan {
  id: string;
  trainingId: string | null;
  metode: string;
  kota: string | null;
  tanggalMulai: string;
  tanggalAkhir: string;
  jumlahPeserta: number;
  totalJam: number;
  totalBiaya: number;
}

/** Satu karyawan peserta beserta biaya perjalanan dinasnya. */
export interface Peserta {
  pegawaiId: string;
  nik: string;
  nama: string;
  regional: string;
  penempatan: string;
  jabatan: string | null;
  biayaTransport: number;
  biayaPerDiem: number;
  biayaPenginapan: number;
}

/** Kolom biaya per peserta yang bisa diubah di tabel. */
export type BiayaPesertaField = "biayaTransport" | "biayaPerDiem" | "biayaPenginapan";

/**
 * Isian form laporan. Angka yang diketik di kotak isian disimpan sebagai
 * teks supaya kotak kosong bisa dibedakan dari angka 0 saat validasi.
 */
export interface LaporanFormValues {
  tanggalMulai: string;
  tanggalAkhir: string;
  metode: string;
  kota: string;
  alamat: string;
  /** Jam per hari untuk tiap jenis pembelajaran */
  jamExperiential: string;
  jamSocial: string;
  jamFormal: string;
  kategoriBiaya: string;
  alokasiBiaya: string;
  /** Biaya pelatihan untuk SATU peserta */
  biayaPelatihan: string;
  peserta: Peserta[];
}

export const emptyLaporanForm: LaporanFormValues = {
  tanggalMulai: "",
  tanggalAkhir: "",
  metode: "",
  kota: "",
  alamat: "",
  jamExperiential: "",
  jamSocial: "",
  jamFormal: "",
  kategoriBiaya: "",
  alokasiBiaya: "",
  biayaPelatihan: "",
  peserta: [],
};

export interface LaporanSummary {
  totalBiaya: number;
  totalJam: number;
  totalPeserta: number;
}

/* -------------------------------------------------------------------------- */
/* 3. Hitungan                                                                 */
/* -------------------------------------------------------------------------- */

/** Teks dari kotak isian angka -> number; kosong atau tidak valid dianggap 0. */
export function toNumber(text: string): number {
  const value = Number(text);
  return Number.isFinite(value) ? value : 0;
}

/**
 * Jumlah hari pelatihan, tanggal mulai & akhir ikut dihitung.
 * Contoh: 16 s/d 18 Maret -> 3 hari. Tanggal belum lengkap -> 0.
 */
export function countDays(tanggalMulai: string, tanggalAkhir: string): number {
  if (!tanggalMulai || !tanggalAkhir) return 0;

  const satuHari = 24 * 60 * 60 * 1000;
  const selisih = Date.parse(tanggalAkhir) - Date.parse(tanggalMulai);
  return selisih >= 0 ? Math.round(selisih / satuHari) + 1 : 0;
}

/** Transport + per diem + penginapan untuk satu peserta. */
export function totalTransportCost(peserta: Peserta): number {
  return peserta.biayaTransport + peserta.biayaPerDiem + peserta.biayaPenginapan;
}

/** Biaya pelatihan + total biaya transport untuk satu peserta. */
export function participantTotalCost(peserta: Peserta, biayaPelatihan: number): number {
  return biayaPelatihan + totalTransportCost(peserta);
}

/* -------------------------------------------------------------------------- */
/* 4. Pemetaan dari/ke backend                                                 */
/* -------------------------------------------------------------------------- */

export function toTrainingRealization(resource: TrainingRealizationResource): Laporan {
  return {
    id: String(resource.id),
    trainingId: resource.training_id === null ? null : String(resource.training_id),
    metode: resource.learning_method,
    kota: resource.learning_city,
    tanggalMulai: resource.start_date,
    tanggalAkhir: resource.end_date,
    jumlahPeserta: resource.total_participants,
    totalJam: resource.total_duration_learning_hours,
    totalBiaya: resource.total_cost,
  };
}

export function toTrainingRealizationSummary(resource: TrainingRealizationSummary): LaporanSummary {
  return {
    totalBiaya: resource.total_cost,
    totalJam: resource.total_learning_hours,
    totalPeserta: resource.total_participants,
  };
}

/** Karyawan yang baru dicentang -> peserta dengan biaya perjalanan dinas 0. */
export function participantFromEmployee(pegawai: Pegawai): Peserta {
  return {
    pegawaiId: pegawai.id,
    nik: pegawai.nik,
    nama: pegawai.nama,
    regional: pegawai.regional,
    penempatan: pegawai.penempatanNama,
    jabatan: pegawai.jabatan,
    biayaTransport: 0,
    biayaPerDiem: 0,
    biayaPenginapan: 0,
  };
}

function toParticipant(detail: TrainingRealizationDetailResource): Peserta {
  const employee = detail.employee;

  return {
    pegawaiId: String(detail.employee_id),
    nik: employee?.nik ?? "-",
    nama: employee?.name ?? "-",
    regional: getPlacementRegional(employee?.entity),
    penempatan: employee?.entity?.name ?? "-",
    jabatan: employee?.jabatan?.name ?? null,
    biayaTransport: detail.transport_cost,
    biayaPerDiem: detail.perdiem_cost,
    biayaPenginapan: detail.travel_expense_cost,
  };
}

/**
 * Isi form dari laporan yang sedang diedit.
 *
 * Backend menyimpan TOTAL jam per peserta (jam/hari x jumlah hari) dan biaya
 * pelatihan per peserta. Karena semua peserta memakai nilai yang sama, nilai
 * form cukup dibaca dari peserta pertama lalu jamnya dibagi jumlah hari.
 */
export function toTrainingRealizationFormValues(resource: TrainingRealizationResource): LaporanFormValues {
  const details = resource.details ?? [];
  const pertama = details[0];
  const hari = resource.duration_days || 1;
  const perDay = (totalJam: number | undefined) =>
    pertama ? String(Math.round((totalJam ?? 0) / hari)) : "";

  return {
    tanggalMulai: resource.start_date,
    tanggalAkhir: resource.end_date,
    metode: resource.learning_method,
    kota: resource.learning_city ?? "",
    alamat: resource.learning_location ?? "",
    jamExperiential: perDay(pertama?.experiental_learning_hours),
    jamSocial: perDay(pertama?.social_learning_hours),
    jamFormal: perDay(pertama?.formal_learning_hours),
    kategoriBiaya: resource.financing_category,
    alokasiBiaya: resource.cost_allocation,
    biayaPelatihan: pertama ? String(pertama.learning_cost) : "",
    peserta: details.map(toParticipant),
  };
}

/** Isian form -> body POST/PUT /api/training-realizations. */
export function toTrainingRealizationPayload(
  trainingId: string,
  form: LaporanFormValues,
): TrainingRealizationPayload {
  const hari = countDays(form.tanggalMulai, form.tanggalAkhir);
  const jamExperiential = toNumber(form.jamExperiential);
  const jamSocial = toNumber(form.jamSocial);
  const jamFormal = toNumber(form.jamFormal);
  const biayaPelatihan = toNumber(form.biayaPelatihan);
  const adaLokasi = needsLocation(form.metode);
  // tahun & bulan laporan mengikuti tanggal mulai, mis. "2026-03-16" -> 2026, 3
  const [tahun, bulan] = form.tanggalMulai.split("-").map(Number);

  return {
    training_id: Number(trainingId),
    learning_method: form.metode,
    // pelatihan online tidak punya lokasi, jadi isian lama ikut dikosongkan
    learning_city: adaLokasi ? form.kota.trim() || null : null,
    learning_location: adaLokasi ? form.alamat.trim() || null : null,
    year: tahun,
    month: bulan,
    start_date: form.tanggalMulai,
    end_date: form.tanggalAkhir,
    duration_days: hari,
    learning_hours_per_day: jamExperiential + jamSocial + jamFormal,
    financing_category: form.kategoriBiaya,
    cost_allocation: form.alokasiBiaya,
    details: form.peserta.map((peserta) => ({
      employee_id: Number(peserta.pegawaiId),
      // yang disimpan backend adalah total jam selama pelatihan
      experiental_learning_hours: jamExperiential * hari,
      social_learning_hours: jamSocial * hari,
      formal_learning_hours: jamFormal * hari,
      learning_cost: biayaPelatihan,
      transport_cost: peserta.biayaTransport,
      perdiem_cost: peserta.biayaPerDiem,
      travel_expense_cost: peserta.biayaPenginapan,
    })),
  };
}
