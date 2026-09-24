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
import { ConsolidationPanel } from "./ConsolidationPanel";
import {
  KARPIM_LEVELS,
  LEVELS,
  LEVEL_COLORS,
  formatEntityName as entityName,
  formatEntityShort as formatRegionalLabel,
  formatNumber,
  formatPercent,
  levelKey,
  levelLabel,
  pesertaPerRegional as data,
  type PesertaDatum as ParticipantDatum,
} from "./dashboardDummyData";

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

const ACCENT = "#334155";

function ParticipantLevelSummary() {
  const perLevel = LEVELS.map((level) => ({
    level,
    value: data.reduce((sum, row) => sum + row[levelKey(level)], 0),
  }));
  const grandTotal = perLevel.reduce((sum, item) => sum + item.value, 0);
  const share = (value: number) =>
    grandTotal > 0 ? (value / grandTotal) * 100 : 0;

  // Dua level dengan peserta terbanyak, ditampilkan urut level
  const dominan = [...perLevel]
    .sort((x, y) => y.value - x.value)
    .slice(0, 2)
    .sort((x, y) => x.level - y.level);
  const dominanShare = share(
    dominan.reduce((sum, item) => sum + item.value, 0),
  );

  return (
    <ConsolidationPanel
      accent={ACCENT}
      title="Total Konsolidasi per Level"
      caption={`Seluruh ${data.length} entity (HO & regional)`}
      headline={formatNumber(grandTotal)}
      headlineUnit="Orang"
      rows={perLevel.map(({ level, value }) => ({
        name: levelLabel(level),
        color: LEVEL_COLORS[level],
        value: formatNumber(value),
        note: `${formatPercent(share(value))} dari total · ${KARPIM_LEVELS.includes(level) ? "Karpim" : "Karpel"}`,
        bar: share(value),
      }))}
      footer={
        <p className="rounded-lg bg-white px-3 py-2 text-[11px] text-slate-500">
          Dominasi segmen:{" "}
          <span className="font-semibold text-slate-800">
            {dominan.map((item) => levelLabel(item.level)).join(" & ")} (
            {formatPercent(dominanShare)})
          </span>
        </p>
      }
    />
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

      <div>
        <ParticipantLevelSummary />
      </div>
    </div>
  );
}
