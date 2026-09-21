import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";

export type OrganizerType =
  | "LPP"
  | "INTERNAL_PTPN"
  | "EKSTERNAL"
  | "KEMENTERIAN";

export type OrganizerStatus = "ACTIVE" | "INACTIVE";

/** Label dropdown & badge — sama dengan enum OrganizerType di backend */
export const ORGANIZER_TYPE_LABEL: Record<OrganizerType, string> = {
  LPP: "Lembaga Pendidikan Perkebunan (LPP)",
  INTERNAL_PTPN: "Internal PTPN Group",
  EKSTERNAL: "Eksternal PTPN Group",
  KEMENTERIAN: "Kementerian / Lembaga Negara",
};

/** Versi pendek untuk badge di tabel */
export const ORGANIZER_TYPE_SHORT: Record<OrganizerType, string> = {
  LPP: "LPP",
  INTERNAL_PTPN: "Internal",
  EKSTERNAL: "Eksternal",
  KEMENTERIAN: "Kementerian",
};

// Bentuk mentah dari backend (OrganizerResource)
interface OrganizerApi {
  id: number;
  name: string;
  type: OrganizerType;
  type_label: string;
  is_ptpn_group: boolean;
  status: OrganizerStatus;
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string | null;
  address: string | null;
  pic_name: string | null;
  pic_phone: string | null;
  pic_email: string | null;
  pic_position: string | null;
  trainings_count?: number;
}

// Bentuk yang dipakai komponen FE
export interface Organizer {
  id: string;
  nama: string;
  tipe: OrganizerType;
  tipeLabel: string;
  isPtpnGroup: boolean;
  status: OrganizerStatus;
  telepon: string | null;
  email: string | null;
  website: string | null;
  kota: string | null;
  alamat: string | null;
  picNama: string | null;
  picTelepon: string | null;
  picEmail: string | null;
  picJabatan: string | null;
  jumlahPelatihan: number;
}

function toOrganizer(o: OrganizerApi): Organizer {
  return {
    id: String(o.id),
    nama: o.name,
    tipe: o.type,
    tipeLabel: o.type_label,
    isPtpnGroup: o.is_ptpn_group,
    status: o.status,
    telepon: o.phone,
    email: o.email,
    website: o.website,
    kota: o.city,
    alamat: o.address,
    picNama: o.pic_name,
    picTelepon: o.pic_phone,
    picEmail: o.pic_email,
    picJabatan: o.pic_position,
    jumlahPelatihan: o.trainings_count ?? 0,
  };
}

export interface OrganizerPayload {
  name: string;
  type: OrganizerType;
  status: OrganizerStatus;
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string | null;
  address: string | null;
  pic_name: string | null;
  pic_phone: string | null;
  pic_email: string | null;
  pic_position: string | null;
}

export interface OrganizerQuery {
  search?: string;
  type?: OrganizerType;
  status?: OrganizerStatus;
  page?: number;
  perPage?: number;
}

// GET /api/v1/organizers
export async function getOrganizers(
  params: OrganizerQuery,
  signal?: AbortSignal,
) {
  const res = await apiGet<OrganizerApi[]>(
    "/organizers",
    {
      search: params.search,
      type: params.type,
      status: params.status,
      page: params.page,
      per_page: params.perPage,
    },
    signal,
  );
  return { rows: res.data.map(toOrganizer), meta: res.meta };
}

// GET /api/v1/organizers/{id}
export async function getOrganizer(id: string, signal?: AbortSignal) {
  const { data } = await apiGet<OrganizerApi>(
    `/organizers/${encodeURIComponent(id)}`,
    undefined,
    signal,
  );
  return toOrganizer(data);
}

// POST /api/v1/organizers
export async function createOrganizer(payload: OrganizerPayload) {
  const { data } = await apiPost<OrganizerApi>("/organizers", payload);
  return toOrganizer(data);
}

// PUT /api/v1/organizers/{id}
export async function updateOrganizer(id: string, payload: OrganizerPayload) {
  const { data } = await apiPut<OrganizerApi>(
    `/organizers/${encodeURIComponent(id)}`,
    payload,
  );
  return toOrganizer(data);
}

// DELETE /api/v1/organizers/{id}
export async function deleteOrganizer(id: string) {
  await apiDelete(`/organizers/${encodeURIComponent(id)}`);
}
