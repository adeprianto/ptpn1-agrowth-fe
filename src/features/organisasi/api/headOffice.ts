import { apiGet } from "@/lib/http-client";
import type { HeadOffice } from "@/types/api/entity";
import { toHeadOfficeDetail, type HeadOfficeDetail } from "../model/entity";

/** GET /api/head-office — 403 untuk akun non-HO */
export async function getHeadOffice(signal?: AbortSignal): Promise<HeadOfficeDetail> {
  const { data } = await apiGet<HeadOffice>("/api/head-office", undefined, signal);
  return toHeadOfficeDetail(data);
}
