"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrainingHourDatum = {
  regional: string;
  target: number;
  realisasi: number;
};

// Satu tempat untuk nama & warna seri, dipakai chart dan panel kanan
const SERIES = {
  target: { name: "Target", color: "#FCB6B0" },
  realisasi: { name: "Realisasi", color: "#5D1E2E" },
} as const;

// DUMMY DATA — nanti diganti hasil GET /api/v1/dashboard/jam-pembelajaran
const data: TrainingHourDatum[] = [
  { regional: "HO", target: 150, realisasi: 125 },
  { regional: "1", target: 150, realisasi: 125 },
  { regional: "2", target: 200, realisasi: 180 },
  { regional: "3", target: 175, realisasi: 150 },
  { regional: "5", target: 70, realisasi: 20 },
  { regional: "7", target: 140, realisasi: 80 },
  { regional: "8", target: 240, realisasi: 80 },
];

const formatHours = (value: number) => `${value.toLocaleString("id-ID")} Jam`;

interface TooltipPayloadItem {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

const formatRegionalLabel = (value: string) =>
  value.toUpperCase() === "HO" ? "HO" : `R${value}`;

const entityName = (value: string) =>
  value.toUpperCase() === "HO" ? "Head Office" : `Regional ${value}`;

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">
        {entityName(String(label))}
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
              {formatHours(Number(item.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingHourSummary() {
  const totalTarget = data.reduce((sum, row) => sum + row.target, 0);
  const totalRealisasi = data.reduce((sum, row) => sum + row.realisasi, 0);

  const rows = [
    { ...SERIES.target, value: totalTarget },
    { ...SERIES.realisasi, value: totalRealisasi },
  ];

  return (
    <div className="w-full">
      <div className="mb-3 border-b border-slate-200 pb-3">
        <span className="text-sm font-medium text-slate-600">
          Total Konsolidasi ({data.length} Entity)
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-2 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: row.color }}
              />
              <span className="text-xs text-slate-600">{row.name}</span>
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {formatHours(row.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrainingHourChart() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="h-72 w-full lg:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="25%"
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              tickFormatter={formatRegionalLabel}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />

            <Bar
              dataKey="target"
              name={SERIES.target.name}
              fill={SERIES.target.color}
            />
            <Bar
              dataKey="realisasi"
              name={SERIES.realisasi.name}
              fill={SERIES.realisasi.color}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="lg:border-l lg:border-slate-100 lg:pl-6">
        <TrainingHourSummary />
      </div>
    </div>
  );
}
