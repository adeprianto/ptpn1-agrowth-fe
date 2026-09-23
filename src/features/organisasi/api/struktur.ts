import { apiGet } from "@/lib/http-client";
import type { EntityTreeNode } from "@/types/api/entity";
import { toStructureNode, type StrukturNode } from "../model/entity";

/**
 * GET /api/entities/tree — pohon Head Office -> Regional -> Unit.
 * Sudah di-scope backend: akun Regional hanya dapat pohon regionalnya sendiri.
 */
export async function getOrganizationStructure(
  signal?: AbortSignal,
): Promise<StrukturNode[]> {
  const { data } = await apiGet<EntityTreeNode[]>("/api/entities/tree", undefined, signal);
  return data.map(toStructureNode);
}
