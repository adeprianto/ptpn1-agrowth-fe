"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartTooltipProps } from "@/features/dashboard/components/charts/chartTooltip";
import { cn } from "cn";
import {
  METRICS,
  formatCompact,
  formatMetric,
  metricByKey,
  type AnalitikRow,
  type MetricKey,
} from "../model/analitik";

/** Lebih dari ini batangnya dibuat mendatar supaya label panjang tetap terbaca */
const MAX_VERTICAL_BARS = 7;
const HORIZONTAL_ROW_HEIGHT = 34;
const MAX_TICK_LENGTH = 26;

const truncate = (value: string) =>
  value.length > MAX_TICK_LENGTH ? `${value.slice(0, MAX_TICK_LENGTH - 1)}…` : value;

const axisTick = { fontSize: 11, fill: "#475569" };

function AnalitikTooltip({
  active,
  payload,
  metric,
}: ChartTooltipProps & { metric: MetricKey }) {
  const row = (payload?.[0] as { payload?: AnalitikRow } | undefined)?.payload;
  if (!active || !row) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">{row.label}</p>
      <div className="space-y-1.5">
        {/* ketiga metrik ditampilkan; yang sedang dipilih ditebalkan */}
        {METRICS.map((m) => (
          <div key={m.key} className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-slate-500">{m.label}</span>
            </div>
            <span
              className={cn(
                m.key === metric ? "font-semibold text-slate-900" : "font-medium text-slate-600",
              )}
            >
              {formatMetric(m.key, row[m.key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AnalitikChartProps {
  rows: AnalitikRow[];
  metric: MetricKey;
  /** Kosongkan kalau tidak ada dimensi lain untuk dimasuki */
  onBarClick?: (label: string) => void;
}

/** Satu batang per nilai dimensi pengelompokan, untuk metrik yang dipilih. */
export function AnalitikChart({ rows, metric, onBarClick }: AnalitikChartProps) {
  const { label: metricLabel, color } = metricByKey[metric];
  const horizontal = rows.length > MAX_VERTICAL_BARS;
  const height = horizontal ? rows.length * HORIZONTAL_ROW_HEIGHT + 40 : 300;

  const bar = (
    <Bar
      dataKey={metric}
      name={metricLabel}
      fill={color}
      radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
      maxBarSize={horizontal ? 20 : 48}
      cursor={onBarClick ? "pointer" : undefined}
    >
      <LabelList
        dataKey={metric}
        position={horizontal ? "right" : "top"}
        fontSize={10}
        fill="#334155"
        formatter={(value) => formatCompact(Number(value))}
      />
    </Bar>
  );

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={
            horizontal
              ? { top: 0, right: 40, left: 0, bottom: 0 }
              : { top: 20, right: 10, left: -10, bottom: 0 }
          }
          onClick={(state) => {
            if (onBarClick && state && state.activeLabel !== undefined) {
              onBarClick(String(state.activeLabel));
            }
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={horizontal}
            horizontal={!horizontal}
            stroke="#8C8C8C"
          />

          {horizontal ? (
            <>
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={axisTick}
                tickFormatter={formatCompact}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={170}
                axisLine={false}
                tickLine={false}
                tick={axisTick}
                tickFormatter={truncate}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={axisTick}
                interval={0}
                tickFormatter={truncate}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={axisTick}
                tickFormatter={formatCompact}
              />
            </>
          )}

          <Tooltip content={<AnalitikTooltip metric={metric} />} cursor={{ fill: "#f8fafc" }} />
          {bar}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
