"use client";

import { cn } from "cn";
import { formatPercent } from "@/features/dashboard/components/charts/dashboardDummyData";
import {
  METRICS,
  formatMetric,
  type AnalitikRow,
  type MetricKey,
  type MetricValues,
} from "../model/analitik";

interface AnalitikTableProps {
  rows: AnalitikRow[];
  total: MetricValues;
  metric: MetricKey;
  /** Judul kolom pertama, mis. "Entity" */
  groupLabel: string;
  /** Kosongkan kalau tidak ada dimensi lain untuk dimasuki */
  onRowClick?: (label: string) => void;
}

/** Rincian angka di balik chart: ketiga metrik plus porsi metrik terpilih. */
export function AnalitikTable({ rows, total, metric, groupLabel, onRowClick }: AnalitikTableProps) {
  const metricLabel = METRICS.find((m) => m.key === metric)?.label;
  const valueClass = (key: MetricKey) =>
    cn(
      "px-4 py-3 text-right whitespace-nowrap tabular-nums",
      key === metric ? "font-semibold text-slate-900" : "text-slate-500",
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
            <th className="px-4 py-3 font-medium">{groupLabel}</th>
            {METRICS.map((m) => (
              <th key={m.key} className="px-4 py-3 text-right font-medium">
                {m.label}
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Porsi {metricLabel}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const share = total[metric] > 0 ? (row[metric] / total[metric]) * 100 : 0;

            return (
              <tr
                key={row.label}
                onClick={onRowClick ? () => onRowClick(row.label) : undefined}
                className={cn(
                  "border-b border-slate-100 last:border-0",
                  onRowClick && "cursor-pointer hover:bg-slate-50",
                )}
              >
                <td className="px-4 py-3 font-medium text-slate-700">{row.label}</td>
                {METRICS.map((m) => (
                  <td key={m.key} className={valueClass(m.key)}>
                    {formatMetric(m.key, row[m.key])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {formatPercent(share)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-800">
            <td className="px-4 py-3">Total</td>
            {METRICS.map((m) => (
              <td key={m.key} className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                {formatMetric(m.key, total[m.key])}
              </td>
            ))}
            <td className="px-4 py-3 text-xs font-normal text-slate-400">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
