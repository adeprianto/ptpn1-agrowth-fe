import { apiGet } from "@/lib/http-client";
import type { EntityResource, EntityType } from "@/types/api/entity";
import { getRegionals } from "./regional";
import { getUnits } from "./unit";

/** Satu opsi dropdown penempatan: Head Office, Regional, atau Unit. */
export interface EntityOption {
  id: number;
  name: string;
  type: EntityType;
}

/**
 * Daftar entity (HO + Regional + Unit) untuk dropdown.
 * Semua sumbernya sudah di-scope backend, jadi akun Regional/Unit otomatis
 * hanya mendapat entity miliknya sendiri.
 */
export async function getEntityOptions(signal?: AbortSignal): Promise<EntityOption[]> {
  const [headOffice, regionals, units] = await Promise.all([
    apiGet<EntityResource[]>("/api/entities", { type: "HEAD_OFFICE" }, signal),
    getRegionals({ per_page: 100 }, signal),
    getUnits({ per_page: 500 }, signal),
  ]);

  return [
    ...headOffice.data.map((e) => ({
      id: e.id,
      name: e.name,
      type: "HEAD_OFFICE" as const,
    })),
    ...regionals.rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: "REGIONAL" as const,
    })),
    ...units.rows.map((u) => ({
      id: u.id,
      name: u.name,
      type: "UNIT" as const,
    })),
  ];
}
