import { apiGet } from "@/lib/http-client";
import type { HeadOffice } from "@/types/api/entity";

/** GET /api/head-office — 403 untuk akun non-HO */
export async function getHeadOffice(signal?: AbortSignal) {
  const { data } = await apiGet<HeadOffice>("/api/head-office", undefined, signal);
  return data;
}
