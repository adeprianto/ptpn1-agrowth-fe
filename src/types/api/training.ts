/**
 * Kontrak kawat modul pelatihan — bentuknya persis seperti yang dikirim dan
 * diterima backend (snake_case). Bentuk yang dipakai komponen ada di
 * `src/features/program-pelatihan/model/pelatihan.ts`.
 */

/**
 * Kolom `hr_development_type`, `competency_type`, dan `learning_sector` di
 * tabel `trainings` bertipe string biasa — backend tidak membatasinya dengan
 * enum. Jadi daftar nilai yang sah beserta labelnya ditetapkan di sini, dan
 * inilah satu-satunya sumber yang dipakai form maupun filter tabel.
 */
export type TrainingHrDevelopmentType =
  | "bod_boc"
  | "agrowallet"
  | "iht"
  | "public_training"
  | "kursus_jabatan"
  | "benchmarking"
  | "program_budaya"
  | "sertifikasi";

export const TRAINING_HR_DEVELOPMENT_TYPE_LABEL: Record<
  TrainingHrDevelopmentType,
  string
> = {
  bod_boc: "Pengembangan BOD/BOC",
  agrowallet: "Agrowallet",
  iht: "In House Training",
  public_training: "Public Training",
  kursus_jabatan: "Kursus Jabatan",
  benchmarking: "Benchmarking",
  program_budaya: "Program Budaya",
  sertifikasi: "Sertifikasi",
};

export type TrainingCompetencyType = "hard" | "soft" | "hard_soft";

export const TRAINING_COMPETENCY_TYPE_LABEL: Record<TrainingCompetencyType, string> = {
  hard: "Hard Competency",
  soft: "Soft Competency",
  hard_soft: "Hard Competency & Soft Competency",
};

export type TrainingLearningSector =
  | "tanaman"
  | "pengolahan"
  | "teknik"
  | "keuangan"
  | "sdm"
  | "ti"
  | "umum";

export const TRAINING_LEARNING_SECTOR_LABEL: Record<TrainingLearningSector, string> = {
  tanaman: "Tanaman",
  pengolahan: "Pengolahan",
  teknik: "Teknik",
  keuangan: "Keuangan",
  sdm: "SDM",
  ti: "IT",
  umum: "Umum",
};

/** Penyelenggara pelatihan seperti yang disisipkan TrainingResource. */
export interface TrainingVendor {
  id: number;
  name: string;
  classification: string | null;
  is_lpp: boolean;
}

/** app/Http/Resources/TrainingResource.php */
export interface TrainingResource {
  id: number;
  name: string;
  hr_development_type: TrainingHrDevelopmentType | null;
  competency_type: TrainingCompetencyType | null;
  learning_sector: TrainingLearningSector | null;
  description: string | null;
  status: boolean;
  vendor_id: number | null;
  vendor: TrainingVendor | null;
  /** Daftar tag, satu baris per tag di tabel `training_tags` */
  tags: string[];
  /** Jumlah realisasi pelatihan; hanya ikut kalau backend menghitungnya */
  realizations_count?: number;
  created_at: string;
  updated_at: string;
}

/**
 * app/Http/Requests/Training/StoreTrainingRequest.php
 *
 * `tags` dikirim utuh sebagai daftar akhir — backend menyamakan isi tabel
 * `training_tags` dengan daftar ini, bukan menambahkannya.
 */
export interface TrainingPayload {
  name: string;
  /**
   * Wajib diisi saat menyimpan. Berbeda dengan `TrainingResource.vendor_id`
   * yang masih boleh null: baris lama bisa kehilangan penyelenggaranya kalau
   * vendornya dihapus (foreign key-nya `nullOnDelete`).
   */
  vendor_id: number;
  hr_development_type: TrainingHrDevelopmentType;
  competency_type: TrainingCompetencyType;
  learning_sector: TrainingLearningSector;
  description: string | null;
  tags: string[];
  status?: boolean;
}

/** Kolom yang bisa di-sort di tabel pelatihan (sama dengan whitelist backend). */
export type TrainingSortKey =
  | "name"
  | "vendor"
  | "hr_development_type"
  | "competency_type"
  | "learning_sector"
  | "status";
