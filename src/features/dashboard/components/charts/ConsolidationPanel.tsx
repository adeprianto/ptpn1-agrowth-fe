import type { ReactNode } from "react";
import { OVER_COLOR } from "./overTarget";

export interface ConsolidationRow {
  name: string;
  color: string;
  value: string;
  /** Keterangan kecil di bawah nama, mis. persentase */
  note?: ReactNode;
  /** 0–100, digambar sebagai bar tipis di bawah baris */
  bar?: number;
  over?: boolean;
}

interface ConsolidationPanelProps {
  /** Warna aksen panel (hex) */
  accent: string;
  title: string;
  caption: string;
  headline: string;
  headlineUnit?: string;
  /** Progress capaian di bawah angka utama */
  progress?: { percent: number; label: string; over?: boolean };
  rows: ConsolidationRow[];
  footer?: ReactNode;
}

/** Panel ringkasan konsolidasi di samping chart, dibuat menonjol */
export function ConsolidationPanel({
  accent,
  title,
  caption,
  headline,
  headlineUnit,
  progress,
  rows,
  footer,
}: ConsolidationPanelProps) {
  return (
    <div
      className="flex h-full flex-col rounded-xl border-2 p-4"
      style={{ borderColor: `${accent}40`, backgroundColor: `${accent}0d` }}
    >
      <p
        className="text-[11px] font-bold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {title}
      </p>
      <p className="text-[11px] text-slate-500">{caption}</p>

      <p className="mt-2 text-3xl font-bold leading-tight text-slate-900">
        {headline}
        {headlineUnit && (
          <span className="ml-1 text-sm font-medium text-slate-500">
            {headlineUnit}
          </span>
        )}
      </p>

      {progress && (
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(progress.percent, 100)}%`,
                backgroundColor: progress.over ? OVER_COLOR : accent,
              }}
            />
          </div>
          <p
            className="mt-1 text-[11px] font-medium"
            style={{ color: progress.over ? OVER_COLOR : accent }}
          >
            {progress.label}
          </p>
        </div>
      )}

      <div className="mt-4 space-y-3 border-t border-white pt-3">
        {rows.map((row) => (
          <div key={row.name}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {row.name}
                  </p>
                  {row.note && (
                    <p
                      className="text-[10px] text-slate-500"
                      style={row.over ? { color: OVER_COLOR } : undefined}
                    >
                      {row.note}
                    </p>
                  )}
                </div>
              </div>
              <span
                className="shrink-0 text-base font-bold text-slate-900"
                style={row.over ? { color: OVER_COLOR } : undefined}
              >
                {row.value}
              </span>
            </div>
            {row.bar !== undefined && (
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(row.bar, 100)}%`,
                    backgroundColor: row.over ? OVER_COLOR : row.color,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {footer && <div className="mt-auto pt-4">{footer}</div>}
    </div>
  );
}
