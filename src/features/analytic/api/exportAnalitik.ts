import { saveBlob } from "@/lib/download-file";
import { METRICS, type AnalitikRow, type MetricKey, type MetricValues } from "../model/analitik";

interface ExportAnalitikInput {
  rows: AnalitikRow[];
  total: MetricValues;
  metric: MetricKey;
  /** Judul kolom pertama, mis. "Entity" */
  groupLabel: string;
  /** Keterangan filter & periode, ditulis di atas tabel */
  keterangan: string;
}

/** Unduh tabel analitik yang sedang tampil sebagai file Excel. */
export async function exportAnalitikExcel({
  rows,
  total,
  metric,
  groupLabel,
  keterangan,
}: ExportAnalitikInput): Promise<void> {
  // exceljs cukup besar, jadi baru dimuat saat tombol Export ditekan
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Analitik");

  const metricLabel = METRICS.find((m) => m.key === metric)?.label ?? metric;

  sheet.addRow([`${metricLabel} per ${groupLabel}`]).font = { bold: true, size: 13 };
  sheet.addRow([keterangan]).font = { italic: true, color: { argb: "FF64748B" } };
  sheet.addRow([]);

  const header = sheet.addRow([
    groupLabel,
    "Biaya (Rp)",
    "Jam Pembelajaran",
    "Peserta",
    `Porsi ${metricLabel}`,
  ]);
  header.font = { bold: true };
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
  });

  for (const row of rows) {
    sheet.addRow([
      row.label,
      row.biaya,
      row.jam,
      row.peserta,
      total[metric] > 0 ? row[metric] / total[metric] : 0,
    ]);
  }

  sheet.addRow(["Total", total.biaya, total.jam, total.peserta, 1]).font = { bold: true };

  sheet.getColumn(1).width = 34;
  sheet.getColumn(2).width = 18;
  sheet.getColumn(2).numFmt = "#,##0";
  sheet.getColumn(3).width = 18;
  sheet.getColumn(3).numFmt = "#,##0";
  sheet.getColumn(4).width = 12;
  sheet.getColumn(4).numFmt = "#,##0";
  sheet.getColumn(5).width = 16;
  sheet.getColumn(5).numFmt = "0.0%";

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `Analitik-${metricLabel}-per-${groupLabel}.xlsx`.replace(/[\s/&]+/g, "-");

  saveBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}
