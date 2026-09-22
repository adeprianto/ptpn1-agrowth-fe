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

// Level BOD 1–6, sama dengan enum `level_bod` di backend. Data pakai angka,
// label "BOD-n" cuma di tampilan.
const LEVELS = [1, 2, 3, 4, 5, 6] as const;
type Level = (typeof LEVELS)[number];
type LevelKey = `level${Level}`;

// Makin gelap = level makin tinggi (BOD-1 paling senior)
const LEVEL_COLORS: Record<Level, string> = {
  1: "#562547",
  2: "#0b2228",
  3: "#bfa437",
  4: "#28e2a1",
  5: "#13f977",
  6: "#b2728d",
};

const levelKey = (level: Level): LevelKey => `level${level}`;
const levelLabel = (level: Level) => `BOD-${level}`;

type ParticipantDatum = { regional: string; total: number } & Record<
  LevelKey,
  number
>;

// DUMMY DATA — jumlah peserta per entity per level.
// Nanti diganti hasil GET /api/v1/dashboard/peserta-per-regional
const rawData: Omit<ParticipantDatum, "total">[] = [
  {
    regional: "HO",
    level1: 12,
    level2: 28,
    level3: 64,
    level4: 95,
    level5: 120,
    level6: 88,
  },
  {
    regional: "1",
    level1: 2,
    level2: 6,
    level3: 18,
    level4: 42,
    level5: 85,
    level6: 130,
  },
  {
    regional: "2",
    level1: 3,
    level2: 8,
    level3: 22,
    level4: 51,
    level5: 97,
    level6: 142,
  },
  {
    regional: "3",
    level1: 2,
    level2: 7,
    level3: 20,
    level4: 48,
    level5: 90,
    level6: 125,
  },

  {
    regional: "5",
    level1: 3,
    level2: 9,
    level3: 25,
    level4: 55,
    level5: 104,
    level6: 150,
  },

  {
    regional: "7",
    level1: 3,
    level2: 8,
    level3: 21,
    level4: 47,
    level5: 92,
    level6: 136,
  },
  {
    regional: "8",
    level1: 1,
    level2: 4,
    level3: 12,
    level4: 30,
    level5: 61,
    level6: 87,
  },
];

// Total per entity dihitung dari jumlah level, supaya tidak mungkin beda
const data: ParticipantDatum[] = rawData.map((row) => ({
  ...row,
  total: LEVELS.reduce((sum, level) => sum + row[levelKey(level)], 0),
}));

const formatNumber = (value: number) => value.toLocaleString("id-ID");

const formatRegionalLabel = (value: string) =>
  value.toUpperCase() === "HO" ? "HO" : `R${value}`;

const entityName = (value: string) =>
  value.toUpperCase() === "HO" ? "Head Office" : `Regional ${value}`;

interface TooltipPayloadItem {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
  payload?: ParticipantDatum;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">
        {entityName(String(label))}
      </p>
      <div className="space-y-1.5">
        {/* Recharts mengirim payload urut bawah→atas; dibalik supaya
            urutannya sama dengan tumpukan yang terlihat (atas→bawah) */}
        {[...payload].reverse().map((item) => (
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
              {formatNumber(Number(item.value))}
            </span>
          </div>
        ))}
      </div>
      {datum && (
        <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-2 text-xs font-semibold">
          <span className="text-slate-600">Total</span>
          <span className="text-slate-800">{formatNumber(datum.total)}</span>
        </div>
      )}
    </div>
  );
}

function ParticipantLevelSummary() {
  const perLevel = LEVELS.map((level) => ({
    level,
    value: data.reduce((sum, row) => sum + row[levelKey(level)], 0),
  }));
  const grandTotal = perLevel.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
        <span className="text-sm font-medium text-slate-600">
          Total Peserta ({data.length} entity)
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {formatNumber(grandTotal)}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {perLevel.map(({ level, value }) => (
          <div
            key={level}
            className="flex items-center justify-between gap-2 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: LEVEL_COLORS[level] }}
              />
              <span className="text-xs text-slate-600">
                {levelLabel(level)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">
                {formatNumber(value)}
              </span>
              <span className="w-10 text-right text-xs font-medium text-slate-400">
                {grandTotal > 0
                  ? `${((value / grandTotal) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegionalParticipantsChart() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="h-80 w-full lg:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="25%"
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
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
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />

            {/* stackId sama = ditumpuk. Bar pertama ada di paling bawah. */}
            {LEVELS.map((level, index) => (
              <Bar
                key={level}
                dataKey={levelKey(level)}
                name={levelLabel(level)}
                stackId="peserta"
                fill={LEVEL_COLORS[level]}
              >
                {/* Total per entity ditaruh di atas segmen paling atas */}
                {index === LEVELS.length - 1 && (
                  <LabelList
                    dataKey="total"
                    position="top"
                    fontSize={11}
                    fill="#334155"
                    formatter={(value) => formatNumber(Number(value))}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="lg:border-l lg:border-slate-100 lg:pl-6">
        <ParticipantLevelSummary />
      </div>
    </div>
  );
}
