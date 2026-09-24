"use client";

import { useState } from "react";
import {
  ENTITIES,
  LEVELS,
  formatNumber,
  formatPercent,
  levelKey,
  levelLabel,
  type Entity,
  type LevelKey,
} from "./dashboardDummyData";

type MatrixRow = { regional: Entity } & Record<LevelKey, number>;
type Mode = "nilai" | "persen";

interface LevelMatrixTableProps {
  data: MatrixRow[];
  /** Satuan nilai, mis. "orang" atau "jam" — dipakai di keterangan */
  unit: string;
  /** Warna dasar (rgb "r, g, b") untuk arsiran sel, makin besar makin pekat */
  heatRgb?: string;
}

// Skala merah (rendah) → kuning → hijau (tinggi), dipakai di mode persen.
// t = 0..1; hue 0 = merah, 60 = kuning, 120 = hijau.
const scaleBackground = (t: number) => `hsl(${t * 120} 80% 87%)`;
const scaleText = (t: number) => `hsl(${t * 120} 70% 24%)`;
const SCALE_GRADIENT = `linear-gradient(to right, ${scaleBackground(0)}, ${scaleBackground(0.5)}, ${scaleBackground(1)})`;

const columnLabel = (entity: Entity) =>
  entity === "HO" ? "HO" : `REG ${entity}`;

/** Matriks baris = level BOD-1..6, kolom = HO & regional */
export function LevelMatrixTable({
  data,
  unit,
  heatRgb = "22, 163, 74",
}: LevelMatrixTableProps) {
  const [mode, setMode] = useState<Mode>("nilai");

  const byEntity = new Map(data.map((row) => [row.regional, row]));
  const valueOf = (entity: Entity, level: (typeof LEVELS)[number]) =>
    byEntity.get(entity)?.[levelKey(level)] ?? 0;
  const columnTotal = (entity: Entity) =>
    LEVELS.reduce((sum, level) => sum + valueOf(entity, level), 0);

  // Mode persen: tiap kolom (entity) = 100%, jadi terlihat komposisi level
  const cellValue = (entity: Entity, level: (typeof LEVELS)[number]) => {
    const value = valueOf(entity, level);
    if (mode === "nilai") return value;
    const total = columnTotal(entity);
    return total > 0 ? (value / total) * 100 : 0;
  };
  const format = (value: number) =>
    mode === "nilai" ? formatNumber(value) : formatPercent(value);

  const values = ENTITIES.flatMap((entity) =>
    LEVELS.map((level) => cellValue(entity, level)),
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
            : `Persentase terhadap total ${unit} di tiap kolom (HO/regional = 100%).`}
        </p>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Tampilkan
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="nilai">Nilai</option>
            <option value="persen">Persentase</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[560px] border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="border-b border-slate-200 px-3 py-2.5 text-left font-semibold">
                Level
              </th>
              {ENTITIES.map((entity) => (
                <th
                  key={entity}
                  className="border-b border-l border-slate-200 px-3 py-2.5 text-center font-semibold"
                >
                  {columnLabel(entity)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((level) => (
              <tr key={level} className="text-slate-700">
                <td className="border-b border-slate-100 bg-slate-50/60 px-3 py-2.5 font-medium text-slate-600">
                  {levelLabel(level)}
                </td>
                {ENTITIES.map((entity) => {
                  const value = cellValue(entity, level);
                  return (
                    <td
                      key={entity}
                      className={`border-b border-l border-slate-100 px-3 py-2.5 text-center tabular-nums ${
                        mode === "persen" ? "font-semibold" : ""
                      }`}
                      style={cellStyle(value)}
                    >
                      {format(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-semibold text-slate-700">
              <td className="px-3 py-2.5">Total</td>
              {ENTITIES.map((entity) => (
                <td
                  key={entity}
                  className="border-l border-slate-200 px-3 py-2.5 text-center tabular-nums"
                >
                  {mode === "nilai"
                    ? formatNumber(columnTotal(entity))
                    : formatPercent(100)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {mode === "persen" && (
        <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-slate-500">
          <span>Rendah ({formatPercent(min)})</span>
          <span
            aria-hidden
            className="h-2.5 w-32 rounded-full ring-1 ring-slate-200"
            style={{ background: SCALE_GRADIENT }}
          />
          <span>Tinggi ({formatPercent(max)})</span>
        </div>
      )}
    </div>
  );
}
