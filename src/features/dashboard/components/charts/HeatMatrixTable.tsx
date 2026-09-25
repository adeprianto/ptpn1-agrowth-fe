"use client";

import { useState, type ReactNode } from "react";
import { formatNumber, formatPercent } from "./dashboardDummyData";

type Mode = "nilai" | "persen";

export interface MatrixAxisItem {
  key: string;
  label: string;
}

interface HeatMatrixTableProps {
  /** Judul kolom pertama, mis. "Level" atau "Bidang" */
  rowHeader: string;
  rows: MatrixAxisItem[];
  columns: MatrixAxisItem[];
  valueOf: (rowKey: string, columnKey: string) => number;
  /** Apa yang dihitung, mis. "peserta" atau "jam pembelajaran" — dipakai di keterangan */
  measure: string;
  /** Satuan nilai, mis. "orang" atau "jam" */
  unit: string;
  /** Sebutan satu baris di keterangan, mis. "level BOD" atau "bidang" */
  rowNoun: string;
  /** Sebutan satu kolom di keterangan, mis. "HO/regional" atau "level BOD" */
  columnNoun: string;
  /** Warna dasar (rgb "r, g, b") untuk arsiran sel mode nilai */
  heatRgb?: string;
  /** Kontrol tambahan di samping dropdown mode, mis. pilihan entity */
  controls?: ReactNode;
}

// Skala merah (porsi kecil) → kuning → hijau (porsi besar), dipakai di mode persen.
// t = 0..1; hue 0 = merah, 60 = kuning, 120 = hijau.
const scaleBackground = (t: number) => `hsl(${t * 120} 80% 87%)`;
const scaleText = (t: number) => `hsl(${t * 120} 70% 24%)`;
const SCALE_GRADIENT = `linear-gradient(to right, ${scaleBackground(0)}, ${scaleBackground(0.5)}, ${scaleBackground(1)})`;

const SELECT_CLASS =
  "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export const matrixSelectClass = SELECT_CLASS;

/**
 * Tabel matriks berarsir dengan pilihan Nilai / Persentase, lengkap dengan
 * kolom Total (kanan) dan baris Total (bawah).
 *
 * Mode persen: SEMUA angka dihitung terhadap total keseluruhan tabel, jadi
 * seluruh sel dijumlah = 100%, kolom Total = porsi tiap baris, baris Total =
 * porsi tiap kolom, dan pojok kanan bawah = 100%.
 */
export function HeatMatrixTable({
  rowHeader,
  rows,
  columns,
  valueOf,
  measure,
  unit,
  rowNoun,
  columnNoun,
  heatRgb = "22, 163, 74",
  controls,
}: HeatMatrixTableProps) {
  const [mode, setMode] = useState<Mode>("nilai");

  // --- Hitungan ---------------------------------------------------------------
  const rowTotal = (rowKey: string) =>
    columns.reduce((sum, column) => sum + valueOf(rowKey, column.key), 0);
  const columnTotal = (columnKey: string) =>
    rows.reduce((sum, row) => sum + valueOf(row.key, columnKey), 0);
  const grandTotal = rows.reduce((sum, row) => sum + rowTotal(row.key), 0);

  /** Porsi sebuah angka terhadap total keseluruhan tabel. */
  const percentOfAll = (value: number) => (grandTotal > 0 ? (value / grandTotal) * 100 : 0);

  /** Angka yang ditampilkan: nilai asli, atau porsinya terhadap total keseluruhan. */
  const show = (value: number) =>
    mode === "nilai" ? formatNumber(value) : formatPercent(percentOfAll(value));

  // --- Warna sel (hanya sel isi, bukan Total) ---------------------------------
  const cells = rows.flatMap((row) =>
    columns.map((column) => ({ row, column, value: valueOf(row.key, column.key) })),
  );
  const max = Math.max(...cells.map((cell) => cell.value));
  const min = Math.min(...cells.map((cell) => cell.value));
  const largest = cells.find((cell) => cell.value === max);

  const cellStyle = (value: number) => {
    if (mode === "nilai") {
      const alpha = max > 0 ? (value / max) * 0.35 : 0;
      return { backgroundColor: `rgba(${heatRgb}, ${alpha})` };
    }
    const t = max > min ? (value - min) / (max - min) : 1;
    return { backgroundColor: scaleBackground(t), color: scaleText(t) };
  };

  const totalCellClass =
    "border-l border-slate-200 bg-slate-50 px-3 py-2.5 text-center font-semibold tabular-nums text-slate-700";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-3">
        {controls}
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Tampilkan
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className={SELECT_CLASS}
          >
            <option value="nilai">Jumlah ({unit})</option>
            <option value="persen">Persentase dari total</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[560px] border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="border-b border-slate-200 px-3 py-2.5 text-left font-semibold">
                {rowHeader}
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-l border-slate-200 px-3 py-2.5 text-center font-semibold"
                >
                  {column.label}
                </th>
              ))}
              <th className="border-b border-l border-slate-200 bg-slate-100 px-3 py-2.5 text-center font-semibold text-slate-600">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="text-slate-700">
                <td className="border-b border-slate-100 bg-slate-50/60 px-3 py-2.5 font-medium text-slate-600">
                  {row.label}
                </td>
                {columns.map((column) => {
                  const value = valueOf(row.key, column.key);
                  return (
                    <td
                      key={column.key}
                      className={`border-b border-l border-slate-100 px-3 py-2.5 text-center tabular-nums ${
                        mode === "persen" ? "font-semibold" : ""
                      }`}
                      style={cellStyle(value)}
                    >
                      {show(value)}
                    </td>
                  );
                })}
                <td className={`border-b ${totalCellClass}`}>{show(rowTotal(row.key))}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-slate-50 font-semibold text-slate-700">
              <td className="border-t border-slate-200 px-3 py-2.5">Total</td>
              {columns.map((column) => (
                <td key={column.key} className={`border-t ${totalCellClass}`}>
                  {show(columnTotal(column.key))}
                </td>
              ))}
              <td className={`border-t ${totalCellClass} bg-slate-100`}>{show(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Keterangan cara membaca, dalam bahasa sehari-hari */}
      <div className="mt-3 space-y-2 rounded-lg bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-500">
        <p className="font-semibold text-slate-600">Cara membaca tabel</p>

        {mode === "nilai" ? (
          <ul className="list-disc space-y-0.5 pl-4">
            <li>
              Setiap angka = jumlah {measure} ({unit}) untuk {rowNoun} dan {columnNoun} tersebut.
            </li>
            <li>
              Kolom <b>Total</b> di kanan = jumlah per {rowNoun}; baris <b>Total</b> di bawah =
              jumlah per {columnNoun}; pojok kanan bawah = jumlah keseluruhan.
            </li>
            {largest && (
              <li>
                Contoh: angka terbesar {formatNumber(largest.value)} {unit} ada di{" "}
                {largest.row.label} — {largest.column.label}.
              </li>
            )}
          </ul>
        ) : (
          <ul className="list-disc space-y-0.5 pl-4">
            <li>
              Setiap angka = bagian (%) dari <b>seluruh {measure}</b> di tabel ini, jadi semua
              angka di dalam tabel dijumlah = 100% (bisa selisih sedikit karena pembulatan).
            </li>
            <li>
              Kolom <b>Total</b> di kanan = porsi tiap {rowNoun}; baris <b>Total</b> di bawah = porsi
              tiap {columnNoun}.
            </li>
            {largest && (
              <li>
                Contoh: {formatPercent(percentOfAll(largest.value))} di {largest.row.label} —{" "}
                {largest.column.label} berarti {formatPercent(percentOfAll(largest.value))} dari
                seluruh {measure} berasal dari {largest.row.label} di {largest.column.label}.
              </li>
            )}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span>Arti warna:</span>
          <span>{mode === "nilai" ? "sedikit" : `porsi kecil (${formatPercent(percentOfAll(min))})`}</span>
          <span
            aria-hidden
            className="h-2.5 w-32 rounded-full ring-1 ring-slate-200"
            style={{
              background:
                mode === "nilai"
                  ? `linear-gradient(to right, rgba(${heatRgb}, 0.03), rgba(${heatRgb}, 0.35))`
                  : SCALE_GRADIENT,
            }}
          />
          <span>{mode === "nilai" ? "banyak" : `porsi besar (${formatPercent(percentOfAll(max))})`}</span>
          <span className="text-slate-400">— kolom & baris Total tidak diberi warna.</span>
        </div>
      </div>
    </div>
  );
}
