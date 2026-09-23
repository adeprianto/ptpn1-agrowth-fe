import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type {
  TrainingRealizationResource,
  TrainingRealizationSummary,
} from "@/types/api/training-realization";
import {
  toTrainingRealization,
  toTrainingRealizationFormValues,
  toTrainingRealizationPayload,
  toTrainingRealizationSummary,
  type LaporanFormValues,
} from "../model/laporan";

export interface LaporanQuery {
  /** Hanya laporan milik pelatihan ini */
  trainingId?: string;
  page?: number;
  perPage?: number;
}

/** GET /api/training-realizations — daftar laporan, terbaru lebih dulu */
export async function getTrainingRealizationList(query: LaporanQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<TrainingRealizationResource[]>(
    "/api/training-realizations",
    {
      training_id: query.trainingId,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  );

  return { rows: data.map(toTrainingRealization), meta };
}

/** GET /api/training-realizations/summary — angka di kartu ringkasan */
export async function getTrainingRealizationSummary(signal?: AbortSignal) {
  const { data } = await apiGet<TrainingRealizationSummary>(
    "/api/training-realizations/summary",
    undefined,
    signal,
  );

  return toTrainingRealizationSummary(data);
}

/**
 * GET /api/training-realizations/{id} — untuk mengisi form edit.
 * Selain isian form, `trainingId` ikut dikembalikan untuk memuat rincian pelatihannya.
 */
export async function getTrainingRealizationForEdit(
  id: string,
  signal?: AbortSignal,
): Promise<{ trainingId: string; form: LaporanFormValues }> {
  const { data } = await apiGet<TrainingRealizationResource>(
    `/api/training-realizations/${id}`,
    undefined,
    signal,
  );

  return { trainingId: String(data.training_id), form: toTrainingRealizationFormValues(data) };
}

/** POST /api/training-realizations — laporan + seluruh peserta sekaligus */
export async function createTrainingRealization(trainingId: string, form: LaporanFormValues) {
  await apiPost("/api/training-realizations", toTrainingRealizationPayload(trainingId, form));
}

/** PUT /api/training-realizations/{id} — peserta lama diganti daftar yang baru */
export async function updateTrainingRealization(
  id: string,
  trainingId: string,
  form: LaporanFormValues,
) {
  await apiPut(`/api/training-realizations/${id}`, toTrainingRealizationPayload(trainingId, form));
}

/** DELETE /api/training-realizations/{id} — pesertanya ikut terhapus */
export async function deleteTrainingRealization(id: string) {
  await apiDelete(`/api/training-realizations/${id}`);
}
