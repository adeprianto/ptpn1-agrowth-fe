import { regionalRows } from "@/features/organisasi/components/regional/regionalDummyData";

export interface JobFamilyMaster {
  code: string;
  name: string;
}

export const jobFamilies: JobFamilyMaster[] = [
  { code: "KADIV", name: "Kepala Divisi" },
  { code: "KASUBDIV", name: "Kepala Sub Divisi" },
  { code: "AST", name: "Asisten" },
  { code: "KABAG", name: "Kepala Bagian" },
  { code: "KASUBAG", name: "Kepala Sub Bagian" },
];

export interface JobFunctionMaster {
  code: string;
  name: string;
}

export const jobFunctions: JobFunctionMaster[] = [
  { code: "SUPPORT", name: "Support Staff" },
  { code: "MGT", name: "Management" },
  { code: "ENG", name: "Engineering" },
  { code: "ADM", name: "Administration" },
];

export interface StrukturDepartemenNode {
  id: string;
  code: string;
  name: string;
  level: number;
  type: string;

  entityCode: string;
  functionCode: string | null;
  parentId: string | null;
}

export const strukturDepartemen: StrukturDepartemenNode[] = [
  {
    id: "1",
    code: "HO-DIR-UT",
    name: "Direktorat Utama",
    level: 1,
    type: "Direktorat",
    entityCode: "HO",
    functionCode: "MGT", // Direktorat -> fungsi manajemen
    parentId: null,
  },
  {
    id: "2",
    code: "HO-DIR-SAR",
    name: "Direktorat Pemasaran dan Aset Manajemen",
    level: 1,
    type: "Direktorat",
    entityCode: "HO",
    functionCode: "MGT",
    parentId: "1",
  },
  {
    id: "3",
    code: "HO-DIR-SDM",
    name: "Direktorat SDM dan TI",
    level: 1,
    type: "Direktorat",
    entityCode: "HO",
    functionCode: "MGT",
    parentId: "1",
  },
  {
    id: "4",
    code: "HO-DIV-DPSB",
    name: "Divisi Pengembangan SDM dan Budaya Perusahaan",
    level: 1,
    type: "Divisi",
    entityCode: "HO",
    functionCode: "ADM", // dipakai oleh JAB001-JAB003
    parentId: "3",
  },
  {
    id: "5",
    code: "HO-DIV-DMPS",
    name: "Divisi Pemasaran",
    level: 1,
    type: "Divisi",
    entityCode: "HO",
    functionCode: "MGT", // dipakai oleh JAB004-JAB006
    parentId: "2",
  },
  {
    id: "6",
    code: "HO-DIV-DOSG",
    name: "Divisi Operasional SDM dan General Affair",
    level: 1,
    type: "Sub Divisi",
    entityCode: "HO",
    functionCode: "SUPPORT",
    parentId: "3",
  },
  {
    id: "7",
    code: "HO-DIV-DSTK",
    name: "People Development Support",
    level: 1,
    type: "Sub Divisi",
    entityCode: "HO",
    functionCode: "SUPPORT",
    parentId: "6",
  },
  {
    id: "8",
    code: "HO-DIV-DSPI-01",
    name: "Manajemen Audit",
    level: 1,
    type: "Sub Divisi",
    entityCode: "HO",
    functionCode: "ADM",
    parentId: "4",
  },
  {
    id: "9",
    code: "HO-DIV-DSPI-02",
    name: "Tim Audit",
    level: 1,
    type: "Sub Divisi",
    entityCode: "HO",
    functionCode: "ADM",
    parentId: "4",
  },
  {
    id: "10",
    code: "HO-DIV-DSPR-01",
    name: "Sekretariat dan GCG",
    level: 1,
    type: "Sub Divisi",
    entityCode: "HO",
    functionCode: "SUPPORT",
    parentId: "5",
  },
];

export interface JabatanMasterRow {
  id: string;
  code: string;
  namaJabatanLengkap: string;
  level: string;
  jobFamilyCode: string;
  organisasiCode: string;
}

export const jabatanMasterRows: JabatanMasterRow[] = [
  {
    id: "1",
    code: "JAB001",
    namaJabatanLengkap: "Kepala Divisi SDM",
    level: "BOD-1",
    jobFamilyCode: "KADIV",
    organisasiCode: "HO-DIV-DPSB",
  },
  {
    id: "2",
    code: "JAB002",
    namaJabatanLengkap: "Kepala Sub Divisi SDM",
    level: "BOD-2",
    jobFamilyCode: "KASUBDIV",
    organisasiCode: "HO-DIV-DPSB",
  },
  {
    id: "3",
    code: "JAB003",
    namaJabatanLengkap: "Asisten Divisi SDM",
    level: "BOD-3",
    jobFamilyCode: "AST",
    organisasiCode: "HO-DIV-DPSB",
  },

  {
    id: "4",
    code: "JAB004",
    namaJabatanLengkap: "Kepala Divisi Pemasaran",
    level: "BOD-1",
    jobFamilyCode: "KADIV",
    organisasiCode: "HO-DIV-DMPS",
  },
  {
    id: "5",
    code: "JAB005",
    namaJabatanLengkap: "Kepala Sub Divisi Pemasaran",
    level: "BOD-2",
    jobFamilyCode: "KASUBDIV",
    organisasiCode: "HO-DIV-DMPS",
  },
  {
    id: "6",
    code: "JAB006",
    namaJabatanLengkap: "Asisten Divisi Pemasaran",
    level: "BOD-3",
    jobFamilyCode: "AST",
    organisasiCode: "HO-DIV-DMPS",
  },
];

export function getJobFamilyName(code: string): string {
  return jobFamilies.find((f) => f.code === code)?.name ?? code;
}

export function getOrganisasiNode(
  code: string,
): StrukturDepartemenNode | undefined {
  return strukturDepartemen.find((n) => n.code === code);
}

export function getEntityLabel(entityCode: string): string {
  if (entityCode === "HO") return "Head Office";
  if (entityCode === "UNIT-KEBUN") return "Unit (Kebun)";
  if (entityCode === "UNIT-PABRIK") return "Unit (Pabrik)";
  return regionalRows.find((r) => r.kode === entityCode)?.nama ?? entityCode;
}

export function getFunctionName(code: string): string {
  return jobFunctions.find((f) => f.code === code)?.name ?? code;
}

export function getAllEntityOptions(): {
  code: string;
  label: string;
  isHo: boolean;
}[] {
  return [
    { code: "HO", label: "Head Office", isHo: true },
    ...regionalRows.map((r) => ({ code: r.kode, label: r.nama, isHo: false })),
    { code: "UNIT-KEBUN", label: "Unit (Kebun)", isHo: false },
    { code: "UNIT-PABRIK", label: "Unit (Pabrik)", isHo: false },
  ];
}
