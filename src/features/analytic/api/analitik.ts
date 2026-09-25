/**
 * Sumber data halaman Analitik Pengembangan.
 *
 * DUMMY — belum ada endpoint analitik. Agregasinya sengaja dikerjakan di sini
 * (bukan di komponen) supaya nanti cukup isi `getAnalitik` diganti request:
 *
 *   GET /api/analytics/development?group_by=entity&date_from=..&date_to=..
 *       &filters[entity][]=Regional 3&filters[bod][]=BOD-4
 *
 * yang membalas `{ rows: [{ label, biaya, jam, peserta }], total: {...} }`
 * dan otomatis dibatasi cakupan akun yang login.
 */
import {
  DIMENSIONS,
  dimensionByKey,
  type AnalitikQuery,
  type AnalitikResult,
  type AnalitikRow,
  type DimensionKey,
  type MetricValues,
} from "../model/analitik";

/** Satu baris realisasi pelatihan yang sudah dirangkum per batch peserta. */
type AnalitikRecord = Record<DimensionKey, string> &
  MetricValues & {
    /** YYYY-MM-DD */
    tanggal: string;
  };

/** Pembangkit acak ber-seed: angka dummy tetap sama setiap kali dimuat. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PERIODE_DUMMY = { mulai: Date.UTC(2026, 0, 1), akhir: Date.UTC(2026, 8, 24) };

const RECORDS: AnalitikRecord[] = (() => {
  const rand = mulberry32(42);
  const pick = <T,>(items: T[]) => items[Math.floor(rand() * items.length)];
  const hari = (PERIODE_DUMMY.akhir - PERIODE_DUMMY.mulai) / 86_400_000;

  return Array.from({ length: 900 }, () => {
    const peserta = 1 + Math.floor(rand() * 6);
    const tanggal = new Date(PERIODE_DUMMY.mulai + Math.floor(rand() * (hari + 1)) * 86_400_000);

    const dims = Object.fromEntries(
      DIMENSIONS.map((dim) => [dim.key, pick(dim.values)]),
    ) as Record<DimensionKey, string>;

    return {
      ...dims,
      tanggal: tanggal.toISOString().slice(0, 10),
      peserta,
      jam: peserta * (8 + Math.floor(rand() * 32)),
      // Rp 1,5–9 jt per peserta, dibulatkan ke ribuan
      biaya: Math.round(peserta * (1_500 + rand() * 7_500)) * 1_000,
    };
  });
})();

const emptyTotal = (): MetricValues => ({ biaya: 0, jam: 0, peserta: 0 });

function add(target: MetricValues, source: MetricValues) {
  target.biaya += source.biaya;
  target.jam += source.jam;
  target.peserta += source.peserta;
}

/**
 * Total biaya/jam/peserta per nilai dimensi `groupBy`, setelah disaring
 * periode dan filter. Dimensi berurutan (Entity, Level BOD) mengikuti urutan
 * bakunya; sisanya dibiarkan tanpa urutan — pengurutan per metrik dilakukan
 * di halaman supaya ganti metrik tidak perlu request ulang.
 */
export async function getAnalitik(
  query: AnalitikQuery,
  signal?: AbortSignal,
): Promise<AnalitikResult> {
  signal?.throwIfAborted();

  const filters = query.filters.filter((f) => f.values.length > 0);
  const matches = RECORDS.filter(
    (record) =>
      record.tanggal >= query.dateFrom &&
      record.tanggal <= query.dateTo &&
      filters.every((f) => f.values.includes(record[f.dim])),
  );

  const total = emptyTotal();
  const groups = new Map<string, AnalitikRow>();

  for (const record of matches) {
    add(total, record);

    const label = record[query.groupBy];
    const row = groups.get(label) ?? { label, ...emptyTotal() };
    add(row, record);
    groups.set(label, row);
  }

  const { ordered, values } = dimensionByKey[query.groupBy];
  const rows = [...groups.values()];
  if (ordered) rows.sort((a, b) => values.indexOf(a.label) - values.indexOf(b.label));

  return { rows, total };
}
