"use client";

import { Building2, Landmark, Network, type LucideIcon } from "lucide-react";
import {
  FormField,
  formInputClass,
  formInputDisableClass,
} from "@/components/shared/FormField";
import { regionalRows } from "@/features/organisasi/components/regional/regionalDummyData";
import {
  jabatanMasterRows,
  strukturDepartemen,
  getJobFamilyName,
  getOrganisasiNode,
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

interface PenempatanJabatanSectionProps {
  value: PenempatanJabatanValue;
  onChange: (value: PenempatanJabatanValue) => void;
}

const levelTabs: { value: LevelPenempatan; label: string; icon: LucideIcon }[] =
  [
    { value: "HO", label: "Head Office", icon: Landmark },
    { value: "Regional", label: "Regional", icon: Network },
    { value: "Unit", label: "Unit", icon: Building2 },
  ];

function resolveEntityCode(value: PenempatanJabatanValue): string | null {
  if (value.levelPenempatan === "HO") return "HO";

  if (value.levelPenempatan === "Regional") {
    if (!value.regionalId) return null;
    return regionalRows.find((r) => r.id === value.regionalId)?.kode ?? null;
  }

  if (!value.unitId) return null;
  const unit = unitOptions.find((u) => u.id === value.unitId);
  return unit ? `UNIT-${unit.jenis.toUpperCase()}` : null;
}

function resolveJabatanOptions(
  value: PenempatanJabatanValue,
): JabatanMasterRow[] {
  const entityCode = resolveEntityCode(value);
  if (!entityCode) return [];

  const organisasiCodes = new Set(
    strukturDepartemen
      .filter((node) => node.entityCode === entityCode)
      .map((node) => node.code),
  );

  return jabatanMasterRows.filter((j) => organisasiCodes.has(j.organisasiCode));
}

export function PenempatanJabatanSection({
  value,
  onChange,
}: PenempatanJabatanSectionProps) {
  const { levelPenempatan, regionalId, unitId, jabatanId } = value;

  const unitsInRegional = unitOptions.filter(
    (u) => u.regionalId === regionalId,
  );
  const jabatanOptions = resolveJabatanOptions(value);
  const selectedJabatan = jabatanOptions.find((j) => j.id === jabatanId);

  const selectedOrganisasi = selectedJabatan
    ? getOrganisasiNode(selectedJabatan.organisasiCode)
    : undefined;
  const jobFunctionName = selectedOrganisasi
    ? getFunctionName(selectedOrganisasi.functionCode ?? "")
    : undefined;

  function handleLevelChange(level: LevelPenempatan) {
    onChange({
      levelPenempatan: level,
      regionalId: "",
      unitId: "",
      jabatanId: "",
    });
  }

  function handleRegionalChange(newRegionalId: string) {
    onChange({
      ...value,
      regionalId: newRegionalId,
      unitId: "",
      jabatanId: "",
    });
  }

  function handleUnitChange(newUnitId: string) {
    onChange({ ...value, unitId: newUnitId, jabatanId: "" });
  }

  function handleJabatanChange(newJabatanId: string) {
    onChange({ ...value, jabatanId: newJabatanId });
  }

  const jabatanDisabled =
    (levelPenempatan === "Regional" && !regionalId) ||
    (levelPenempatan === "Unit" && !unitId);

  const jabatanPlaceholder =
    levelPenempatan === "Regional" && !regionalId
      ? "Pilih Regional dahulu"
      : levelPenempatan === "Unit" && !unitId
        ? "Pilih Unit dahulu"
        : "Pilih posisi jabatan...";

  return (
    <div className="space-y-5">
      <FormField label="Level Penempatan" required>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {levelTabs.map((tab) => {
            const isActive = levelPenempatan === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleLevelChange(tab.value)}
                className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </FormField>

      {(levelPenempatan === "Regional" || levelPenempatan === "Unit") && (
        <FormField label="Pilih Regional" required>
          <select
            value={regionalId}
            onChange={(e) => handleRegionalChange(e.target.value)}
            className={formInputClass}
          >
            <option value="">Pilih Regional...</option>
            {regionalRows.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nama}
              </option>
            ))}
          </select>
        </FormField>
      )}

      {levelPenempatan === "Unit" && (
        <FormField
          label="Pilih Unit"
          required
          hint={!regionalId ? "Pilih Regional dahulu" : undefined}
        >
          <select
            value={unitId}
            onChange={(e) => handleUnitChange(e.target.value)}
            disabled={!regionalId}
            className={`${formInputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
          >
            <option value="">Pilih Unit...</option>
            {unitsInRegional.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.jenis})
              </option>
            ))}
          </select>
        </FormField>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField
            label="Posisi Jabatan"
            required
            hint={
              !jabatanDisabled && jabatanOptions.length === 0
                ? "Belum ada master jabatan untuk office ini"
                : undefined
            }
          >
            <select
              value={jabatanId}
              onChange={(e) => handleJabatanChange(e.target.value)}
              disabled={jabatanDisabled || jabatanOptions.length === 0}
              required
              className={`${formInputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
            >
              <option value="">{jabatanPlaceholder}</option>
              {jabatanOptions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.namaJabatanLengkap}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Job Group (Job Family)" required>
          <div className={formInputDisableClass}>
            {selectedJabatan
              ? getJobFamilyName(selectedJabatan.jobFamilyCode)
              : "Pilih posisi terlebih dahulu."}
          </div>
        </FormField>

        <FormField label="Job Function" required>
          <div className={formInputDisableClass}>
            {jobFunctionName ?? "Pilih posisi terlebih dahulu."}
          </div>
        </FormField>

        <FormField label="Level">
          <div className={formInputDisableClass}>
            {selectedJabatan?.level ?? "Pilih posisi terlebih dahulu."}
          </div>
        </FormField>
      </div>
    </div>
  );
}
