import type { MasterRef } from "@/types/api/master-data";

/**
 * Master data sederhana (business type, kategori operasional, tipe organisasi,
 * job function) dalam bentuk yang dipakai UI.
 */
export interface MasterItem {
  id: string;
  kode: string;
  nama: string;
}

export function toMasterItem(ref: MasterRef): MasterItem {
  return { id: String(ref.id), kode: ref.code, nama: ref.name };
}

export function toMasterItems(refs: MasterRef[] | null | undefined): MasterItem[] {
  return refs?.map(toMasterItem) ?? [];
}

/** Ubah daftar master jadi opsi `<Select>` */
export function toSelectOptions(items: MasterItem[]) {
  return items.map((item) => ({ value: item.id, label: item.nama }));
}

/**
 * Bedakan item yang namanya kembar dengan menambahkan kodenya.
 * Contoh: komoditas "Kelapa Sawit" ada dua (KELAPA & SAWIT) di master, jadi
 * di dropdown ditampilkan sebagai "Kelapa Sawit (KELAPA)".
 */
export function withDistinctLabels(items: MasterItem[]): MasterItem[] {
  const count = new Map<string, number>();
  for (const item of items) {
    count.set(item.nama, (count.get(item.nama) ?? 0) + 1);
  }

  return items.map((item) =>
    (count.get(item.nama) ?? 0) > 1
      ? { ...item, nama: `${item.nama} (${item.kode})` }
      : item,
  );
}
