/**
 * Impor peserta dari file template Excel yang sudah diisi user.
 *
 * Alurnya (lihat `importParticipantsFromExcel`):
 * 1. Baca baris isian dari sheet "Data Peserta"
 * 2. Pastikan biaya pelatihan sama untuk semua baris (form hanya punya satu nilai)
 * 3. Cari karyawannya lewat API berdasarkan NIK — otomatis dibatasi cakupan akun
 * 4. Susun daftar peserta; baris yang tidak bisa dipakai dicatat alasannya
 *
 * Nilai di kolom abu-abu (Nama, Regional, dst.) sengaja tidak dibaca: data
 * karyawan selalu diambil ulang dari server supaya pasti benar.
 */
import type { Worksheet } from "exceljs";
import { formatRupiah } from "@/lib/format";
import { getEmployeeList } from "@/features/pegawai/api/pegawai";
import type { Pegawai } from "@/features/pegawai/model/pegawai";
import { participantFromEmployee, type Peserta } from "../model/laporan";

/** Satu baris isian di file, sebelum dicocokkan ke data karyawan. */
interface RowIsian {
  /** Nomor baris di Excel, untuk pesan ke user */
  baris: number;
  nik: string;
  biayaPelatihan: number;
  transport: number;
  perDiem: number;
  penginapan: number;
}

export interface ImportResult {
  peserta: Peserta[];
  /** Biaya pelatihan per peserta dari file; `null` kalau kolomnya kosong semua */
  biayaPelatihan: string | null;
  /** Baris yang dilewati beserta alasannya, mis. "Baris 12: NIK 123 tidak ditemukan" */
  dilewati: string[];
}

/** Jumlah NIK per request ke API, supaya alamat request tidak terlalu panjang. */
const NIK_PER_REQUEST = 100;

export async function importParticipantsFromExcel(file: File): Promise<ImportResult> {
  // 1. Baca baris isian --------------------------------------------------------
  const rows = await readRows(file);
  if (rows.length === 0) {
    throw new Error("Tidak ada NIK yang diisi di file. Isi kolom NIK* di sheet Data Peserta.");
  }

  // 2. Biaya pelatihan harus satu nilai (baris yang kosong biayanya diabaikan) --
  const daftarBiaya = [...new Set(rows.map((row) => row.biayaPelatihan).filter((biaya) => biaya > 0))];
  if (daftarBiaya.length > 1) {
    throw new Error(
      `Biaya Pelatihan di file berbeda-beda (${daftarBiaya.map(formatRupiah).join(", ")}). ` +
        "Samakan biaya pelatihan untuk semua peserta, lalu unggah ulang.",
    );
  }

  // 3. Cari karyawan per NIK, sebanyak NIK_PER_REQUEST sekali minta ------------
  const semuaNik = [...new Set(rows.map((row) => row.nik))];
  const karyawanPerNik = new Map<string, Pegawai>();
  for (let i = 0; i < semuaNik.length; i += NIK_PER_REQUEST) {
    const niks = semuaNik.slice(i, i + NIK_PER_REQUEST);
    const { rows: karyawan } = await getEmployeeList({ niks, perPage: niks.length });
    for (const pegawai of karyawan) karyawanPerNik.set(pegawai.nik, pegawai);
  }

  // 4. Susun daftar peserta -------------------------------------------------------
  const peserta: Peserta[] = [];
  const dilewati: string[] = [];
  const sudahDipakai = new Set<string>();

  for (const row of rows) {
    const pegawai = karyawanPerNik.get(row.nik);

    if (!pegawai) {
      dilewati.push(`Baris ${row.baris}: NIK ${row.nik} tidak ditemukan atau di luar cakupan akun.`);
      continue;
    }
    if (sudahDipakai.has(row.nik)) {
      dilewati.push(`Baris ${row.baris}: NIK ${row.nik} sudah ada di baris sebelumnya.`);
      continue;
    }

    sudahDipakai.add(row.nik);
    peserta.push({
      ...participantFromEmployee(pegawai),
      biayaTransport: row.transport,
      biayaPerDiem: row.perDiem,
      biayaPenginapan: row.penginapan,
    });
  }

  return {
    peserta,
    biayaPelatihan: daftarBiaya.length === 1 ? String(daftarBiaya[0]) : null,
    dilewati,
  };
}

/**
 * Ambil baris isian dari sheet "Data Peserta". Letak tabel dicari lewat judul
 * kolom "NIK*" di kolom A, jadi tetap terbaca walau baris keterangan di atas
 * tabel bertambah atau berkurang.
 */
async function readRows(file: File): Promise<RowIsian[]> {
  // exceljs cukup besar, jadi baru dimuat saat user benar-benar memilih file
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch {
    throw new Error("File tidak dapat dibaca. Pastikan file berformat .xlsx dari template.");
  }

  const sheet = workbook.getWorksheet("Data Peserta");
  if (!sheet) {
    throw new Error('Sheet "Data Peserta" tidak ditemukan. Gunakan file dari tombol Unduh Template.');
  }

  const barisJudul = findHeaderRow(sheet);
  if (!barisJudul) {
    throw new Error('Judul kolom "NIK*" tidak ditemukan. Gunakan file dari tombol Unduh Template.');
  }

  // Kolom sesuai template: A = NIK, G = Biaya Pelatihan, H = Transport,
  // I = Per Diem, J = Penginapan
  const rows: RowIsian[] = [];
  for (let r = barisJudul + 1; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const nik = row.getCell("A").text.trim();
    if (!nik) continue; // baris kosong

    rows.push({
      baris: r,
      nik,
      biayaPelatihan: toNumber(row.getCell("G").value),
      transport: toNumber(row.getCell("H").value),
      perDiem: toNumber(row.getCell("I").value),
      penginapan: toNumber(row.getCell("J").value),
    });
  }

  return rows;
}

function findHeaderRow(sheet: Worksheet): number | null {
  for (let r = 1; r <= 30; r++) {
    if (sheet.getRow(r).getCell("A").text.trim() === "NIK*") return r;
  }
  return null;
}

/** Nilai sel uang -> angka. Sel kosong / bukan angka dianggap 0. */
function toNumber(value: unknown): number {
  if (typeof value === "number") return Math.max(0, Math.round(value));
  if (typeof value === "string") return Number(value.replace(/\D/g, "")) || 0;
  return 0;
}
