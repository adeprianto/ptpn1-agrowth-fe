import type { BadgeTone } from "@/components/ui";
import {
  VENDOR_TYPE_LABEL,
  type VendorPayload,
  type VendorResource,
  type VendorType,
} from "@/types/api/vendor";

export type { VendorType as PenyelenggaraTipe };

/** Label panjang untuk dropdown (sama dengan VendorType::label() di backend). */
export const PENYELENGGARA_TIPE_LABEL = VENDOR_TYPE_LABEL;

/** Label pendek untuk badge di tabel. */
export const PENYELENGGARA_TIPE_SHORT: Record<VendorType, string> = {
  lpp: "LPP",
  internal: "Internal PTPN",
  eksternal: "Eksternal",
};

export const PENYELENGGARA_TIPE_TONE: Record<VendorType, BadgeTone> = {
  lpp: "emerald",
  internal: "blue",
  eksternal: "amber",
};

/** Satu penyelenggara pelatihan dalam bentuk yang dipakai komponen. */
export interface Penyelenggara {
  id: string;
  nama: string;
  tipe: VendorType | null;
  tipeLabel: string;
  isLpp: boolean;
  telepon: string | null;
  email: string | null;
  website: string | null;
  kota: string | null;
  alamat: string | null;
  picNama: string | null;
  picTelepon: string | null;
  picEmail: string | null;
  picJabatan: string | null;
  aktif: boolean;
}

/** Isian form penyelenggara; dipetakan ke `VendorPayload` sebelum dikirim. */
export interface PenyelenggaraInput {
  nama: string;
  tipe: VendorType;
  telepon: string;
  email: string;
  website: string;
  kota: string;
  alamat: string;
  picNama: string;
  picTelepon: string;
  picEmail: string;
  picJabatan: string;
  aktif: boolean;
}

export function toVendor(resource: VendorResource): Penyelenggara {
  return {
    id: String(resource.id),
    nama: resource.name,
    tipe: resource.classification,
    tipeLabel:
      resource.classification_label ??
      (resource.classification ? PENYELENGGARA_TIPE_SHORT[resource.classification] : "-"),
    isLpp: resource.is_lpp,
    telepon: resource.phone,
    email: resource.email,
    website: resource.website,
    kota: resource.city,
    alamat: resource.address,
    picNama: resource.pic_name,
    picTelepon: resource.pic_phone,
    picEmail: resource.pic_email,
    picJabatan: resource.pic_position,
    aktif: resource.status,
  };
}

/** Input kosong dikirim sebagai null — kolomnya nullable di backend. */
const orNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export function toVendorPayload(input: PenyelenggaraInput): VendorPayload {
  return {
    name: input.nama.trim(),
    classification: input.tipe,
    phone: orNull(input.telepon),
    email: orNull(input.email),
    website: orNull(input.website),
    city: orNull(input.kota),
    address: orNull(input.alamat),
    pic_name: orNull(input.picNama),
    pic_phone: orNull(input.picTelepon),
    pic_email: orNull(input.picEmail),
    pic_position: orNull(input.picJabatan),
    status: input.aktif,
  };
}

/** Isi form dari data yang sedang diedit. */
export function toVendorInput(row: Penyelenggara): PenyelenggaraInput {
  return {
    nama: row.nama,
    tipe: row.tipe ?? "eksternal",
    telepon: row.telepon ?? "",
    email: row.email ?? "",
    website: row.website ?? "",
    kota: row.kota ?? "",
    alamat: row.alamat ?? "",
    picNama: row.picNama ?? "",
    picTelepon: row.picTelepon ?? "",
    picEmail: row.picEmail ?? "",
    picJabatan: row.picJabatan ?? "",
    aktif: row.aktif,
  };
}
