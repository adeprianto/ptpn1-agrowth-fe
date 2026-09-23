import {
  TRAINING_COMPETENCY_TYPE_LABEL,
  TRAINING_HR_DEVELOPMENT_TYPE_LABEL,
  TRAINING_LEARNING_SECTOR_LABEL,
  type TrainingCompetencyType,
  type TrainingHrDevelopmentType,
  type TrainingLearningSector,
  type TrainingPayload,
  type TrainingResource,
} from "@/types/api/training";

export type {
  TrainingCompetencyType as JenisKompetensi,
  TrainingHrDevelopmentType as JenisPsdm,
  TrainingLearningSector as BidangPelatihan,
};

export const JENIS_PSDM_LABEL = TRAINING_HR_DEVELOPMENT_TYPE_LABEL;
export const JENIS_KOMPETENSI_LABEL = TRAINING_COMPETENCY_TYPE_LABEL;
export const BIDANG_LABEL = TRAINING_LEARNING_SECTOR_LABEL;

/** Satu program pelatihan dalam bentuk yang dipakai komponen. */
export interface Pelatihan {
  id: string;
  nama: string;
  penyelenggaraId: string | null;
  penyelenggara: string | null;
  jenisPsdm: TrainingHrDevelopmentType | null;
  jenisPsdmLabel: string;
  jenisKompetensi: TrainingCompetencyType | null;
  jenisKompetensiLabel: string;
  bidang: TrainingLearningSector | null;
  bidangLabel: string;
  deskripsi: string | null;
  tags: string[];
  aktif: boolean;
  /** Berapa kali pelatihan ini sudah direalisasikan */
  jumlahRealisasi: number;
}

/** Isian form pelatihan; dipetakan ke `TrainingPayload` sebelum dikirim. */
export interface PelatihanInput {
  nama: string;
  penyelenggaraId: string;
  jenisPsdm: TrainingHrDevelopmentType;
  jenisKompetensi: TrainingCompetencyType;
  bidang: TrainingLearningSector;
  deskripsi: string;
  tags: string[];
  aktif: boolean;
}

/** Ambil label dari daftar nilai yang sah; nilai asing tetap ditampilkan apa adanya. */
function labelOf<T extends string>(
  labels: Record<T, string>,
  value: T | null,
): string {
  if (!value) return "-";
  return labels[value] ?? value;
}

export function toTraining(resource: TrainingResource): Pelatihan {
  return {
    id: String(resource.id),
    nama: resource.name,
    penyelenggaraId: resource.vendor_id === null ? null : String(resource.vendor_id),
    penyelenggara: resource.vendor?.name ?? null,
    jenisPsdm: resource.hr_development_type,
    jenisPsdmLabel: labelOf(JENIS_PSDM_LABEL, resource.hr_development_type),
    jenisKompetensi: resource.competency_type,
    jenisKompetensiLabel: labelOf(JENIS_KOMPETENSI_LABEL, resource.competency_type),
    bidang: resource.learning_sector,
    bidangLabel: labelOf(BIDANG_LABEL, resource.learning_sector),
    deskripsi: resource.description,
    tags: resource.tags,
    aktif: resource.status,
    jumlahRealisasi: resource.realizations_count ?? 0,
  };
}

/** Input kosong dikirim sebagai null — kolomnya nullable di backend. */
const orNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export function toTrainingPayload(input: PelatihanInput): TrainingPayload {
  return {
    name: input.nama.trim(),
    // sudah dipastikan terisi oleh validasi form sebelum sampai ke sini
    vendor_id: Number(input.penyelenggaraId),
    hr_development_type: input.jenisPsdm,
    competency_type: input.jenisKompetensi,
    learning_sector: input.bidang,
    description: orNull(input.deskripsi),
    // dikirim utuh: backend menyamakan isi tabel tag dengan daftar ini
    tags: input.tags,
    status: input.aktif,
  };
}

/** Isi form dari data yang sedang diedit. */
export function toTrainingInput(row: Pelatihan): PelatihanInput {
  return {
    nama: row.nama,
    penyelenggaraId: row.penyelenggaraId ?? "",
    jenisPsdm: row.jenisPsdm as TrainingHrDevelopmentType,
    jenisKompetensi: row.jenisKompetensi as TrainingCompetencyType,
    bidang: row.bidang as TrainingLearningSector,
    deskripsi: row.deskripsi ?? "",
    tags: row.tags,
    aktif: row.aktif,
  };
}
