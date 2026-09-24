"use client";

import type { ReactNode } from "react";
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
import { formatNumber, formatPercent } from "./dashboardDummyData";
import {
  ChartLegend,
  OVER_COLOR,
  OverBadge,
  OverTargetNotice,
  capaian,
  isOverTarget,
} from "./overTarget";
import { overTargetBarShape } from "./overTargetBarShape";

type Datum = { target: number; realisasi: number };

interface TargetRealisasiChartProps<T extends Datum> {
  data: T[];
  /** Field kategori sumbu X, mis. "regional" atau "bidang" */
  categoryKey: keyof T & string;
  /** Label pendek di sumbu X */
  formatTick?: (value: string) => string;
  /** Nama lengkap di tooltip & banner */
  formatName?: (value: string) => string;
  formatValue: (value: number) => string;
  colors: { target: string; realisasi: string };
  /** Yang dilampaui, untuk teks banner, mis. "target jam" */
  subject: string;
  /** Panel ringkasan di kanan chart */
  side: ReactNode;
}

const identity = (value: string) => value;
const overShape = overTargetBarShape((d) =>
  isOverTarget(d.realisasi, d.target),
);

interface TooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { payload?: Datum }[];
  formatName: (value: string) => string;
  formatValue: (value: number) => string;
  colors: { target: string; realisasi: string };
}

function CustomTooltip({
  active,
  label,
  payload,
  formatName,
  formatValue,
  colors,
}: TooltipProps) {
  const datum = payload?.[0]?.payload;
  if (!active || !datum) return null;
  const over = isOverTarget(datum.realisasi, datum.target);

  const rows = [
    { name: "RKAP", value: datum.target, color: colors.target },
    {
      name: "Realisasi",
      value: datum.realisasi,
      color: over ? OVER_COLOR : colors.realisasi,
    },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-800">
          {formatName(String(label))}
        </p>
        {over && <OverBadge label="Melebihi RKAP" />}
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: row.color }}
              />
              <span className="text-slate-500">{row.name}</span>
            </div>
            <span className="font-medium text-slate-800">
              {formatValue(row.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-2 text-xs font-semibold">
        <span className="text-slate-600">Capaian</span>
        <span style={{ color: over ? OVER_COLOR : undefined }}>
          {formatPercent(capaian(datum.realisasi, datum.target))}
        </span>
      </div>
    </div>
  );
}

/** Bar target vs realisasi; realisasi di atas target diwarnai & diberi banner */
export function TargetRealisasiChart<T extends Datum>({
  data,
  categoryKey,
  formatTick = identity,
  formatName = identity,
  formatValue,
  colors,
  subject,
  side,
}: TargetRealisasiChartProps<T>) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <OverTargetNotice
          subject={subject}
          hint="Bar oranye = realisasi di atas RKAP."
          items={data.map((row) => ({
            label: formatName(String(row[categoryKey])),
            realisasi: row.realisasi,
            target: row.target,
          }))}
        />

        <ChartLegend
          items={[
            { color: colors.target, label: "RKAP" },
            { color: colors.realisasi, label: "Realisasi" },
            { color: OVER_COLOR, label: "Melebihi RKAP" },
          ]}
        />

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap="25%"
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey={categoryKey as string}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#475569" }}
                tickFormatter={formatTick}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    formatName={formatName}
                    formatValue={formatValue}
                    colors={colors}
                  />
                }
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="target" name="RKAP" fill={colors.target}>
                <LabelList
                  dataKey="target"
                  position="top"
                  fontSize={10}
                  fill="#334155"
                  formatter={(value) => formatNumber(Number(value))}
                />
              </Bar>
              <Bar
                dataKey="realisasi"
                name="Realisasi"
                fill={colors.realisasi}
                shape={overShape}
              >
                <LabelList
                  dataKey="realisasi"
                  position="top"
                  fontSize={10}
                  fill="#334155"
                  formatter={(value) => formatNumber(Number(value))}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>{side}</div>
    </div>
  );
}
