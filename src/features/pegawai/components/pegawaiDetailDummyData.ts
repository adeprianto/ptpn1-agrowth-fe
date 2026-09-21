export type CompetencyLevel =
  | "Novice"
  | "Beginner"
  | "Competent"
  | "Proficient";

export const competencyLevelValue: Record<CompetencyLevel, number> = {
  Novice: 1,
  Beginner: 2,
  Competent: 3,
  Proficient: 4,
};

export interface CompetencyRow {
  aspek: string;
  aktual: CompetencyLevel;
  dibutuhkan: CompetencyLevel;
}

// DUMMY DATA — master kompetensi & penilaian belum ada di backend. Nanti
// requirement diambil per position_title_id, level aktual dari hasil penilaian.
export const kompetensiDummy: CompetencyRow[] = [
  {
    aspek: "Penguasaan Teknis Lapangan",
    aktual: "Proficient",
    dibutuhkan: "Competent",
  },
  { aspek: "Komunikasi", aktual: "Novice", dibutuhkan: "Beginner" },
  { aspek: "Kedisiplinan", aktual: "Proficient", dibutuhkan: "Competent" },
  {
    aspek: "K3 / Keselamatan Kerja",
    aktual: "Competent",
    dibutuhkan: "Competent",
  },
  {
    aspek: "Problem Solving",
    aktual: "Beginner",
    dibutuhkan: "Proficient",
  },
  { aspek: "Kepemimpinan", aktual: "Beginner", dibutuhkan: "Beginner" },
];
