import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { callBackend } from "@/lib/api-client";
import { getPlacementRegional, levelBodLabel } from "@/features/pegawai/model/pegawai";
import { toTraining } from "@/features/program-pelatihan/model/pelatihan";
import { toAuthUser } from "@/types/auth";
import type { EmployeeResource } from "@/types/api/employee";
import type { TrainingResource } from "@/types/api/training";
import type { ApiResponse } from "@/types/api/response";
import type { UserResource } from "@/types/api/user";

/** Karyawan diambil per halaman sebanyak ini (backend tidak membatasi). */
const PER_PAGE = 2000;
/** Jumlah baris kosong yang disiapkan untuk diisi user. */
const DATA_ROWS = 500;
/** Baris header tabel di sheet "Data Peserta" (baris 1-8 berisi judul & detail pelatihan). */
const HEADER_ROW = 10;
const FIRST_DATA_ROW = HEADER_ROW + 1;
const LAST_DATA_ROW = HEADER_ROW + DATA_ROWS;

const GREY_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF1F5F9" },
};

/** Garis tipis di keempat sisi sel tabel supaya batas tiap sel jelas. */
const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FF94A3B8" } },
  left: { style: "thin", color: { argb: "FF94A3B8" } },
  bottom: { style: "thin", color: { argb: "FF94A3B8" } },
  right: { style: "thin", color: { argb: "FF94A3B8" } },
};

/**
 * GET /api/training-realizations/participants-template?training_id=14
 *
 * Membuat file Excel template daftar peserta + biaya pelatihan:
 * - sheet "Data Peserta": tempat user mengisi NIK dan biaya; kolom lain terisi
 *   otomatis lewat VLOOKUP ke sheet acuan
 * - sheet "Data Acuan": seluruh karyawan dalam cakupan akun yang login,
 *   disembunyikan (veryHidden) dan dikunci
 *
 * Detail pelatihan (`training_id`) ditulis di bagian atas template supaya
 * jelas file ini untuk pelatihan apa.
 *
 * Cakupan karyawan (HO / Regional / Unit) sudah dibatasi backend sesuai token
 * sesi, jadi di sini cukup memanggil endpoint yang sama dengan tabel karyawan.
 */
export async function GET(request: NextRequest) {
  const trainingId = request.nextUrl.searchParams.get("training_id");
  if (!trainingId) {
    return NextResponse.json(
      { success: false, message: "Parameter training_id wajib diisi.", data: null },
      { status: 422 },
    );
  }

  try {
    // 1. User yang login ------------------------------------------------------
    const me = await callBackend<ApiResponse<UserResource>>("/me");
    if (me.status !== 200) {
      return NextResponse.json(me.body, { status: me.status });
    }
    const user = toAuthUser(me.body.data);

    // 1b. Pelatihan yang dilaporkan -------------------------------------------
    const trainingRes = await callBackend<ApiResponse<TrainingResource>>(
      `/trainings/${encodeURIComponent(trainingId)}`,
    );
    if (trainingRes.status !== 200) {
      return NextResponse.json(trainingRes.body, { status: trainingRes.status });
    }
    const training = toTraining(trainingRes.body.data);

    // 2. Seluruh karyawan dalam cakupan user (loop semua halaman) -------------
    //    Diurutkan per NIK (unik) supaya tidak ada baris terlewat/ganda antar halaman.
    const employees: EmployeeResource[] = [];
    let page = 1;
    let lastPage = 1;
    do {
      const res = await callBackend<ApiResponse<EmployeeResource[]>>(
        `/employees?per_page=${PER_PAGE}&page=${page}&sort=nik&direction=asc`,
      );
      if (res.status !== 200) {
        return NextResponse.json(res.body, { status: res.status });
      }
      employees.push(...res.body.data);
      lastPage = res.body.meta?.last_page ?? 1;
      page++;
    } while (page <= lastPage);

    // 3. Daftar acuan sederhana -----------------------------------------------
    const acuan = employees.map((employee) => ({
      nik: employee.nik,
      nama: employee.nama_lengkap || employee.name,
      regional: getPlacementRegional(employee.entity),
      unit: employee.entity?.name ?? "-",
      jabatan: employee.jabatan?.name ?? "-",
      bodLevel: levelBodLabel(employee.jabatan?.level_bod ?? null),
    }));

    // 4. Label "Regional" & "Unit" di kepala template, sesuai role ------------
    let regionalLabel: string;
    let unitLabel: string;
    if (user.role === "HO") {
      regionalLabel = "Head Office";
      unitLabel = "Head Office";
    } else if (user.role === "REGIONAL") {
      regionalLabel = `Kantor ${user.officeName}`;
      unitLabel = "Seluruh Unit";
    } else {
      regionalLabel = employees[0]?.entity?.parent?.name ?? "-";
      unitLabel = user.officeName;
    }

    // 5. Workbook ---------------------------------------------------------------
    const workbook = new ExcelJS.Workbook();
    // exceljs tidak menghitung formula; minta Excel menghitung semuanya saat dibuka
    workbook.calcProperties.fullCalcOnLoad = true;

    // Sheet "Data Peserta" dibuat pertama supaya jadi sheet yang terbuka.
    const peserta = workbook.addWorksheet("Data Peserta");
    const acuanSheet = workbook.addWorksheet("Data Acuan");

    // --- 5a. Sheet "Data Acuan" ---
    acuanSheet.columns = [
      { header: "NIK", key: "nik", width: 14 },
      { header: "Nama", key: "nama", width: 36 },
      { header: "Regional", key: "regional", width: 18 },
      { header: "Unit", key: "unit", width: 28 },
      { header: "Jabatan", key: "jabatan", width: 40 },
      { header: "BOD Level", key: "bodLevel", width: 11 },
    ];
    acuanSheet.addRows(acuan);
    acuanSheet.getRow(1).font = { bold: true };
    acuanSheet.state = "veryHidden";
    await acuanSheet.protect("", { selectLockedCells: false });

    // Range VLOOKUP dibuat presisi (bukan A:F) supaya Excel tidak menghitung
    // sampai 1 juta baris. Minimal baris 2 supaya range tetap sah walau kosong.
    const acuanLastRow = Math.max(2, acuan.length + 1);
    const acuanRange = `'Data Acuan'!$A$2:$F$${acuanLastRow}`;

    // --- 5b. Sheet "Data Peserta" ---
    peserta.getCell("A1").value =
      "Template Peserta Pelatihan — Laporan Realisasi Pengembangan SDM";
    peserta.getCell("A1").font = { bold: true, size: 14 };

    // Detail pelatihan & cakupan, satu baris per keterangan (baris 2-8).
    // Label ditebalkan di kolom A, nilainya di kolom B (dibiarkan melebar ke kanan).
    const details: [string, string][] = [
      ["Nama Pelatihan", training.nama],
      ["Penyelenggara", training.penyelenggara ?? "-"],
      ["Jenis Pengembangan SDM", training.jenisPsdmLabel],
      ["Jenis Kompetensi", training.jenisKompetensiLabel],
      ["Bidang", training.bidangLabel],
      ["Regional", regionalLabel],
      ["Unit", unitLabel],
    ];
    details.forEach(([label, value], index) => {
      const row = peserta.getRow(2 + index);
      row.getCell("A").value = label;
      row.getCell("A").font = { bold: true };
      row.getCell("B").value = `: ${value}`;
    });
    // baris 9 sengaja kosong sebagai jarak sebelum tabel

    // Kolom tabel: `auto` = diisi rumus & dikunci (abu-abu), sisanya diisi user.
    const columns = [
      // cukup lebar juga untuk label detail pelatihan di baris 2-8
      { header: "NIK*", width: 24, auto: false },
      { header: "Nama", width: 34, auto: true },
      { header: "Regional", width: 16, auto: true },
      { header: "Unit", width: 24, auto: true },
      { header: "Jabatan", width: 34, auto: true },
      { header: "BOD Level", width: 11, auto: true },
      { header: "Biaya Pelatihan", width: 16, auto: false },
      { header: "Transport", width: 14, auto: false },
      { header: "Per Diem", width: 14, auto: false },
      { header: "Penginapan", width: 14, auto: false },
      { header: "Total BPD", width: 15, auto: true },
      { header: "Total Biaya", width: 16, auto: true },
    ];

    const header = peserta.getRow(HEADER_ROW);
    columns.forEach((column, index) => {
      peserta.getColumn(index + 1).width = column.width;
      const cell = header.getCell(index + 1);
      cell.value = column.header;
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = THIN_BORDER;
    });

    for (let r = FIRST_DATA_ROW; r <= LAST_DATA_ROW; r++) {
      const row = peserta.getRow(r);
      // Hasil VLOOKUP: kosong kalau NIK belum diisi, "NIHIL" kalau NIK tidak ada di acuan
      const lookup = (index: number) =>
        `IF($A${r}="","",IFERROR(VLOOKUP($A${r},${acuanRange},${index},FALSE),"NIHIL"))`;

      row.getCell("A").numFmt = "@"; // NIK disimpan sebagai teks, sama seperti di acuan
      row.getCell("B").value = { formula: lookup(2) };
      row.getCell("C").value = { formula: lookup(3) };
      row.getCell("D").value = { formula: lookup(4) };
      row.getCell("E").value = { formula: lookup(5) };
      row.getCell("F").value = { formula: lookup(6) };
      row.getCell("K").value = { formula: `IF($A${r}="","",SUM(H${r}:J${r}))` };
      row.getCell("L").value = { formula: `IF($A${r}="","",G${r}+K${r})` };

      columns.forEach((column, index) => {
        const cell = row.getCell(index + 1);
        cell.border = THIN_BORDER;
        if (column.auto) {
          cell.fill = GREY_FILL; // terkunci (bawaan exceljs)
        } else {
          cell.protection = { locked: false }; // bisa diisi user
        }
      });
      for (const col of ["G", "H", "I", "J", "K", "L"]) {
        row.getCell(col).numFmt = "#,##0";
      }
    }

    // Seluruh baris jadi merah kalau NIK diisi tapi tidak ditemukan
    peserta.addConditionalFormatting({
      ref: `A${FIRST_DATA_ROW}:L${LAST_DATA_ROW}`,
      rules: [
        {
          type: "expression",
          priority: 1,
          formulae: [`AND($A${FIRST_DATA_ROW}<>"",$B${FIRST_DATA_ROW}="NIHIL")`],
          style: { fill: { type: "pattern", pattern: "solid", bgColor: { argb: "FFFFC7CE" } } },
        },
      ],
    });

    // Tanpa password: mencegah salah ketik di kolom otomatis, bukan untuk keamanan
    await peserta.protect("", {});

    // 6. Kirim sebagai file ------------------------------------------------------
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Template-Peserta-Pelatihan.xlsx"',
      },
    });
  } catch (error) {
    console.error("[participants-template] gagal membuat template:", error);

    return NextResponse.json(
      { success: false, message: "Gagal membuat template Excel.", data: null },
      { status: 500 },
    );
  }
}
