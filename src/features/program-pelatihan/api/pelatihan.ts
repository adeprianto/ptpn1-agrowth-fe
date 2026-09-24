import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type {
  TrainingCompetencyType,
  TrainingHrDevelopmentType,
  TrainingLearningSector,
  TrainingResource,
} from "@/types/api/training";
import {
  toTraining,
  toTrainingPayload,
  type Pelatihan,
  type PelatihanInput,
} from "../model/pelatihan";

export interface PelatihanQuery {
  /** Pencarian gabungan nama pelatihan + tag */
  search?: string;
  /** Kotak cari per kolom */
  nama?: string;
  penyelenggara?: string;
  tag?: string;
  /** Daftar centang — boleh lebih dari satu nilai */
  tags?: string[];
  jenisPsdm?: TrainingHrDevelopmentType[];
  jenisKompetensi?: TrainingCompetencyType[];
  bidang?: TrainingLearningSector[];
  status?: string[];
  sort?: string;
  direction?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

/** GET /api/trainings */
export async function getTrainingList(
  query: PelatihanQuery = {},
  signal?: AbortSignal,
) {
  const { data, meta } = await apiGet<TrainingResource[]>(
    "/api/trainings",
    {
      search: query.search,
      name: query.nama,
      vendor: query.penyelenggara,
      tag: query.tag,
      tags: query.tags,
      hr_development_type: query.jenisPsdm,
      competency_type: query.jenisKompetensi,
      learning_sector: query.bidang,
      status: query.status,
      sort: query.sort,
      direction: query.direction,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  );

  return { rows: data.map(toTraining), meta };
}

/** GET /api/trainings/tags — isi checklist filter kolom Tag */
export async function getTrainingTags(signal?: AbortSignal): Promise<string[]> {
  const { data } = await apiGet<string[]>("/api/trainings/tags", undefined, signal);
  return data;
}

/** GET /api/trainings/{id} */
export async function getTraining(
  id: string,
  signal?: AbortSignal,
): Promise<Pelatihan> {
  const { data } = await apiGet<TrainingResource>(
    `/api/trainings/${id}`,
    undefined,
    signal,
  );

  return toTraining(data);
}

/** POST /api/trainings */
export async function createTraining(input: PelatihanInput) {
  const { data } = await apiPost<TrainingResource>(
    "/api/trainings",
    toTrainingPayload(input),
  );

  return toTraining(data);
}

/** PUT /api/trainings/{id} */
export async function updateTraining(id: string, input: PelatihanInput) {
  const { data } = await apiPut<TrainingResource>(
    `/api/trainings/${id}`,
    toTrainingPayload(input),
  );

  return toTraining(data);
}

/** DELETE /api/trainings/{id} */
export async function deleteTraining(id: string) {
  await apiDelete(`/api/trainings/${id}`);
}
