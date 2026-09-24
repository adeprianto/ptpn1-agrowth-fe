"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartTooltipProps } from "./chartTooltip";
import { ConsolidationPanel } from "./ConsolidationPanel";
import {
  KARPEL_LEVELS,
  KARPIM_LEVELS,
  PESERTA_SERIES as SERIES,
  levelLabel,
  formatEntityName,
  formatEntityShort,
  formatNumber,
  formatPercent,
  pesertaPerRegional as data,
} from "./dashboardDummyData";

const formatOrang = (value: number) => `${formatNumber(value)} Orang`;

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">
        {formatEntityName(String(label))}
      </p>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div
            key={String(item.dataKey)}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-500">{item.name}</span>
            </div>
            <span className="font-medium text-slate-800">
              {formatOrang(item.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParticipantTypeSummary() {
  const totalKarpim = data.reduce((sum, row) => sum + row.karpim, 0);
  const totalKarpel = data.reduce((sum, row) => sum + row.karpel, 0);
  const total = totalKarpim + totalKarpel;
  const terbanyak = data.reduce((best, row) =>
    row.total > best.total ? row : best,
  );
  const share = (value: number) => (total > 0 ? (value / total) * 100 : 0);

  const rows = [
    { ...SERIES.karpim, value: totalKarpim, levels: KARPIM_LEVELS },
    { ...SERIES.karpel, value: totalKarpel, levels: KARPEL_LEVELS },
  ].map((row) => ({
    name: row.name,
    color: row.color,
    value: formatNumber(row.value),
    note: `${formatPercent(share(row.value))} dari total · ${levelLabel(row.levels[0])} s/d ${levelLabel(row.levels[row.levels.length - 1])}`,
    bar: share(row.value),
  }));

  return (
    <ConsolidationPanel
      accent={SERIES.karpel.color}
      title="Total Konsolidasi Peserta"
      caption={`Seluruh ${data.length} entity (HO & regional)`}
      headline={formatNumber(total)}
      headlineUnit="Orang"
      rows={rows}
      footer={
        <p className="rounded-lg bg-white px-3 py-2 text-[11px] text-slate-500">
          Peserta terbanyak:{" "}
          <span className="font-semibold text-slate-800">
            {formatEntityName(terbanyak.regional)} (
            {formatNumber(terbanyak.total)} orang)
          </span>
        </p>
      }
    />
  );
}

/** Peserta per entity, bar Karpim & Karpel berdampingan */
export function ParticipantTypeChart() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="h-72 w-full lg:col-span-2">
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
              dataKey="regional"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#475569" }}
              tickFormatter={formatEntityShort}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />

            <Bar
              dataKey="karpim"
              name={SERIES.karpim.name}
              fill={SERIES.karpim.color}
            >
              <LabelList
                dataKey="karpim"
                position="top"
                fontSize={10}
                fill="#334155"
                formatter={(value) => formatNumber(Number(value))}
              />
            </Bar>
            <Bar
              dataKey="karpel"
              name={SERIES.karpel.name}
              fill={SERIES.karpel.color}
            >
              <LabelList
                dataKey="karpel"
                position="top"
                fontSize={10}
                fill="#334155"
                formatter={(value) => formatNumber(Number(value))}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <ParticipantTypeSummary />
      </div>
    </div>
  );
}
