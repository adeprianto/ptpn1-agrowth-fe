"use client";

import { Building2, Landmark, Network } from "lucide-react";
import {
  Field,
  SegmentedControl,
  Select,
  StaticValue,
  type SegmentedOption,
} from "@/components/ui";
import { regionalRows } from "@/features/organisasi/components/regional/regionalDummyData";
import {
  jabatanMasterRows,
  strukturDepartemen,
  getJobFamilyName,
  getOrganizationNode,
  getFunctionName,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";
import { unitOptions } from "./pegawaiFormDummyData";

export type LevelPenempatan = "HO" | "Regional" | "Unit";

export interface PenempatanJabatanValue {
  levelPenempatan: LevelPenempatan;
  regionalId: string;
  unitId: string;
  jabatanId: string;
}

const LEVEL_OPTIONS: SegmentedOption<LevelPenempatan>[] = [
  { value: "HO", label: "Head Office", icon: Landmark },
  { value: "Regional", label: "Regional", icon: Network },
  { value: "Unit", label: "Unit", icon: Building2 },
];

/** Kode entity yang sedang dipilih, dipakai untuk menyaring master jabatan. */
function resolveEntityCode(value: PenempatanJabatanValue): string | null {
  if (value.levelPenempatan === "HO") return "HO";

  if (value.levelPenempatan === "Regional") {
    if (!value.regionalId) return null;
    return regionalRows.find((row) => row.id === value.regionalId)?.kode ?? null;
  }

  if (!value.unitId) return null;
  const unit = unitOptions.find((option) => option.id === value.unitId);
  return unit ? `UNIT-${unit.jenis.toUpperCase()}` : null;
}

function resolvePositionOptions(value: PenempatanJabatanValue): JabatanMasterRow[] {
  const entityCode = resolveEntityCode(value);
  if (!entityCode) return [];

  const organisasiCodes = new Set(
    strukturDepartemen
      .filter((node) => node.entityCode === entityCode)
      .map((node) => node.code),
  );

  return jabatanMasterRows.filter((jabatan) =>
    organisasiCodes.has(jabatan.organisasiCode),
  );
}

/** Pesan error per isian, dari `validate` milik form induknya. */
export type PenempatanJabatanErrors = Partial<
  Record<"regionalId" | "unitId" | "jabatanId", string>
>;

interface PenempatanJabatanSectionProps {
  value: PenempatanJabatanValue;
  onChange: (value: PenempatanJabatanValue) => void;
  errors?: PenempatanJabatanErrors;
}

/**
 * Pemilihan penempatan pegawai (HO / Regional / Unit) beserta posisi
 * jabatannya. Job Group, Job Function, dan Level ikut otomatis dari posisi
 * yang dipilih, jadi ketiganya hanya ditampilkan.
 */
export function PenempatanJabatanSection({
  value,
  onChange,
  errors = {},
}: PenempatanJabatanSectionProps) {
  const { levelPenempatan, regionalId, unitId, jabatanId } = value;

  const unitsInRegional = unitOptions.filter(
    (option) => option.regionalId === regionalId,
  );
  const jabatanOptions = resolvePositionOptions(value);
  const selectedJabatan = jabatanOptions.find((jabatan) => jabatan.id === jabatanId);

  const selectedOrganisasi = selectedJabatan
    ? getOrganizationNode(selectedJabatan.organisasiCode)
    : undefined;
  const jobFunctionName = selectedOrganisasi
    ? getFunctionName(selectedOrganisasi.functionCode ?? "")
    : undefined;

  // Pilihan di bawahnya selalu direset supaya tidak menyimpan kombinasi mustahil
  const handleLevelChange = (level: LevelPenempatan) =>
    onChange({ levelPenempatan: level, regionalId: "", unitId: "", jabatanId: "" });

  const handleRegionalChange = (nextRegionalId: string) =>
    onChange({ ...value, regionalId: nextRegionalId, unitId: "", jabatanId: "" });

  const handleUnitChange = (nextUnitId: string) =>
    onChange({ ...value, unitId: nextUnitId, jabatanId: "" });

  const jabatanDisabled =
    (levelPenempatan === "Regional" && !regionalId) ||
    (levelPenempatan === "Unit" && !unitId);

  const jabatanPlaceholder =
    levelPenempatan === "Regional" && !regionalId
      ? "Pilih Regional dahulu"
      : levelPenempatan === "Unit" && !unitId
        ? "Pilih Unit dahulu"
        : "Pilih posisi jabatan...";

  const PLACEHOLDER_TURUNAN = "Pilih posisi terlebih dahulu.";

  return (
    <div className="space-y-5">
      <Field label="Level Penempatan" required>
        <SegmentedControl
          options={LEVEL_OPTIONS}
          value={levelPenempatan}
          onChange={handleLevelChange}
        />
      </Field>

      {(levelPenempatan === "Regional" || levelPenempatan === "Unit") && (
        <Field label="Pilih Regional" required error={errors.regionalId}>
          <Select
            value={regionalId}
            invalid={Boolean(errors.regionalId)}
            placeholder="Pilih Regional..."
            options={regionalRows.map((row) => ({
              value: row.id,
              label: row.nama,
            }))}
            onChange={(event) => handleRegionalChange(event.target.value)}
          />
        </Field>
      )}

      {levelPenempatan === "Unit" && (
        <Field
          label="Pilih Unit"
          required
          error={errors.unitId}
          hint={!regionalId ? "Pilih Regional dahulu" : undefined}
        >
          <Select
            value={unitId}
            invalid={Boolean(errors.unitId)}
            disabled={!regionalId}
            placeholder="Pilih Unit..."
            options={unitsInRegional.map((unit) => ({
              value: unit.id,
              label: `${unit.name} (${unit.jenis})`,
            }))}
            onChange={(event) => handleUnitChange(event.target.value)}
          />
        </Field>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          className="sm:col-span-2"
          label="Posisi Jabatan"
          required
          error={errors.jabatanId}
          hint={
            !jabatanDisabled && jabatanOptions.length === 0
              ? "Belum ada master jabatan untuk office ini"
              : undefined
          }
        >
          <Select
            value={jabatanId}
            invalid={Boolean(errors.jabatanId)}
            disabled={jabatanDisabled || jabatanOptions.length === 0}
            placeholder={jabatanPlaceholder}
            options={jabatanOptions.map((jabatan) => ({
              value: jabatan.id,
              label: jabatan.namaJabatanLengkap,
            }))}
            onChange={(event) =>
              onChange({ ...value, jabatanId: event.target.value })
            }
          />
        </Field>

        <Field label="Job Group (Job Family)" required>
          <StaticValue placeholder={PLACEHOLDER_TURUNAN}>
            {selectedJabatan && getJobFamilyName(selectedJabatan.jobFamilyCode)}
          </StaticValue>
        </Field>

        <Field label="Job Function" required>
          <StaticValue placeholder={PLACEHOLDER_TURUNAN}>
            {jobFunctionName}
          </StaticValue>
        </Field>

        <Field label="Level">
          <StaticValue placeholder={PLACEHOLDER_TURUNAN}>
            {selectedJabatan?.level}
          </StaticValue>
        </Field>
      </div>
    </div>
  );
}
