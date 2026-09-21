import { apiGet } from "@/lib/api-client";
import type { MasterRef } from "./masterData";
import { getRegionals } from "./regional";
import { getUnits } from "./unit";

export type EntityTier = "HO" | "Regional" | "Unit";

export interface EntityOption {
  id: string;
  nama: string;
  tier: EntityTier;
}

/**
 * Daftar entity (HO + Regional + Unit) untuk dropdown.
 * Semua sumbernya sudah di-scope backend, jadi akun Regional/Unit otomatis
 * hanya mendapat entity miliknya sendiri.
 */
export async function getEntityOptions(
  signal?: AbortSignal,
): Promise<EntityOption[]> {
  const [ho, regionals, units] = await Promise.all([
    apiGet<MasterRef[]>("/entities", { type: "HEAD_OFFICE" }, signal),
    getRegionals({ perPage: 100 }, signal),
    getUnits({ perPage: 500 }, signal),
  ]);

  return [
    ...ho.data.map((e) => ({
      id: String(e.id),
      nama: e.name,
      tier: "HO" as const,
    })),
    ...regionals.rows.map((r) => ({
      id: r.id,
      nama: r.nama,
      tier: "Regional" as const,
    })),
    ...units.rows.map((u) => ({
      id: u.id,
      nama: u.nama,
      tier: "Unit" as const,
    })),
  ];
}
