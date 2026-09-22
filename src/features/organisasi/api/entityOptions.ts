import { apiGet } from "@/lib/http-client";
import type { EntityResource } from "@/types/api/entity";
import type { EntityOption } from "../model/entity";
import { getRegionals } from "./regional";
import { getUnits } from "./unit";

export type { EntityOption };

/**
 * Daftar entity (HO + Regional + Unit) untuk dropdown.
 * Semua sumbernya sudah di-scope backend, jadi akun Regional/Unit otomatis
 * hanya mendapat entity miliknya sendiri.
 */
export async function getEntityOptions(signal?: AbortSignal): Promise<EntityOption[]> {
  const [headOffice, regionals, units] = await Promise.all([
    apiGet<EntityResource[]>("/api/entities", { type: "HEAD_OFFICE" }, signal),
    getRegionals({ perPage: 100 }, signal),
    getUnits({ perPage: 500 }, signal),
  ]);

  return [
    ...headOffice.data.map((entity) => ({
      id: String(entity.id),
      nama: entity.name,
      tipe: "HO" as const,
    })),
    ...regionals.rows.map((regional) => ({
      id: regional.id,
      nama: regional.nama,
      tipe: "Regional" as const,
    })),
    ...units.rows.map((unit) => ({
      id: unit.id,
      nama: unit.nama,
      tipe: "Unit" as const,
    })),
  ];
}
