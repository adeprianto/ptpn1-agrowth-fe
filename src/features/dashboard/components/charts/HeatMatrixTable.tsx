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
  /** Satuan nilai, mis. "orang" atau "jam" — dipakai di keterangan */
  unit: string;
  /** Nama kolom di keterangan persen, mis. "HO/regional" atau "level BOD" */
  columnNoun: string;
  /** Warna dasar (rgb "r, g, b") untuk arsiran sel mode nilai */
  heatRgb?: string;
  /** Tampilkan kolom Total per baris di ujung kanan */
  showRowTotal?: boolean;
  /** Kontrol tambahan di samping dropdown mode, mis. pilihan entity */
  controls?: ReactNode;
}

// Skala merah (rendah) → kuning → hijau (tinggi), dipakai di mode persen.
// t = 0..1; hue 0 = merah, 60 = kuning, 120 = hijau.
const scaleBackground = (t: number) => `hsl(${t * 120} 80% 87%)`;
const scaleText = (t: number) => `hsl(${t * 120} 70% 24%)`;
const SCALE_GRADIENT = `linear-gradient(to right, ${scaleBackground(0)}, ${scaleBackground(0.5)}, ${scaleBackground(1)})`;

const SELECT_CLASS =
  "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export const matrixSelectClass = SELECT_CLASS;

/**
 * Tabel matriks berarsir dengan pilihan Nilai / Persentase. Mode persen
 * dihitung per kolom (tiap kolom = 100%) dan diwarnai merah → hijau.
 */
export function HeatMatrixTable({
  rowHeader,
  rows,
  columns,
  valueOf,
  unit,
  columnNoun,
  heatRgb = "22, 163, 74",
  showRowTotal = false,
  controls,
}: HeatMatrixTableProps) {
  const [mode, setMode] = useState<Mode>("nilai");

  const columnTotal = (columnKey: string) =>
    rows.reduce((sum, row) => sum + valueOf(row.key, columnKey), 0);
  const rowTotal = (rowKey: string) =>
    columns.reduce((sum, column) => sum + valueOf(rowKey, column.key), 0);
  const grandTotal = rows.reduce((sum, row) => sum + rowTotal(row.key), 0);
  const percentOf = (value: number, total: number) =>
    total > 0 ? (value / total) * 100 : 0;

  // Mode persen: tiap kolom = 100%, jadi terlihat komposisi di kolom itu
  const cellValue = (rowKey: string, columnKey: string) => {
    const value = valueOf(rowKey, columnKey);
    return mode === "nilai" ? value : percentOf(value, columnTotal(columnKey));
  };
  const format = (value: number) =>
    mode === "nilai" ? formatNumber(value) : formatPercent(value);

  const values = rows.flatMap((row) =>
    columns.map((column) => cellValue(row.key, column.key)),
  );
  const max = Math.max(...values);
  const min = Math.min(...values);

  const cellStyle = (value: number) => {
    if (mode === "nilai") {
      const alpha = max > 0 ? (value / max) * 0.35 : 0;
      return { backgroundColor: `rgba(${heatRgb}, ${alpha})` };
    }
    const t = max > min ? (value - min) / (max - min) : 1;
    return { backgroundColor: scaleBackground(t), color: scaleText(t) };
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-slate-400">
          {mode === "nilai"
            ? `Nilai dalam satuan ${unit}.`
            : `Persentase terhadap total ${unit} di tiap kolom (${columnNoun} = 100%).`}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {controls}
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Tampilkan
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className={SELECT_CLASS}
            >
              <option value="nilai">Nilai</option>
              <option value="persen">Persentase</option>
            </select>
          </label>
        </div>
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
              {showRowTotal && (
                <th className="border-b border-l border-slate-200 px-3 py-2.5 text-center font-semibold">
                  Total
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="text-slate-700">
                <td className="border-b border-slate-100 bg-slate-50/60 px-3 py-2.5 font-medium text-slate-600">
                  {row.label}
                </td>
                {columns.map((column) => {
                  const value = cellValue(row.key, column.key);
                  return (
                    <td
                      key={column.key}
                      className={`border-b border-l border-slate-100 px-3 py-2.5 text-center tabular-nums ${
                        mode === "persen" ? "font-semibold" : ""
                      }`}
                      style={cellStyle(value)}
                    >
                      {format(value)}
                    </td>
                  );
                })}
                {showRowTotal && (
                  <td className="border-b border-l border-slate-200 bg-slate-50 px-3 py-2.5 text-center font-semibold tabular-nums text-slate-700">
                    {mode === "nilai"
                      ? formatNumber(rowTotal(row.key))
                      : formatPercent(percentOf(rowTotal(row.key), grandTotal))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-semibold text-slate-700">
              <td className="px-3 py-2.5">Total</td>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border-l border-slate-200 px-3 py-2.5 text-center tabular-nums"
                >
                  {mode === "nilai"
                    ? formatNumber(columnTotal(column.key))
                    : formatPercent(100)}
                </td>
              ))}
              {showRowTotal && (
                <td className="border-l border-slate-200 px-3 py-2.5 text-center tabular-nums">
                  {mode === "nilai"
                    ? formatNumber(grandTotal)
                    : formatPercent(100)}
                </td>
              )}
            </tr>
          </tfoot>
        </table>
      </div>

      {mode === "persen" && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          {showRowTotal ? (
            <span className="text-slate-400">
              Kolom Total = porsi baris terhadap total keseluruhan.
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-2">
            <span>Rendah ({formatPercent(min)})</span>
            <span
              aria-hidden
              className="h-2.5 w-32 rounded-full ring-1 ring-slate-200"
              style={{ background: SCALE_GRADIENT }}
            />
            <span>Tinggi ({formatPercent(max)})</span>
          </span>
        </div>
      )}
    </div>
  );
}
