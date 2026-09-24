"use client";

import { useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type DotItemDotProps,
  type LabelProps,
} from "recharts";
import { BreakdownPanel } from "./BreakdownPanel";
import { BIAYA_SERIES, formatCompact } from "./dashboardDummyData";
import {
  ENTITY_OPTIONS,
  developmentCostByEntity,
  type EntityValue,
  type MonthlyCost,
} from "./developmentCostDummyData";
import {
  ChartLegend,
  OVER_COLOR,
  OverBadge,
  OverTargetNotice,
  SerapanBadge,
  capaian,
  isOverTarget,
} from "./overTarget";
import { highlightTick } from "./overTargetBarShape";

const SERIES = BIAYA_SERIES;

/**
 * Titik garis. Bulan terpilih diperbesar dengan cincin; realisasi yang
 * melebihi anggaran berwarna oranye. Saat ada bulan terpilih, titik lain
 * dipudarkan.
 */
function renderDot(
  { cx, cy, payload, index }: DotItemDotProps,
  color: string,
  selected: string | null,
  markOver: boolean,
) {
  const datum = payload as MonthlyCost | undefined;
  const active = selected !== null && datum?.bulan === selected;
  const dimmed = selected !== null && !active;
  const over =
    markOver &&
    datum !== undefined &&
    isOverTarget(datum.realisasi, datum.target);
  const fill = over ? OVER_COLOR : color;

  if (active) {
    return (
      <g key={index}>
        <circle cx={cx} cy={cy} r={9} fill={fill} fillOpacity={0.2} />
        <circle
          cx={cx}
          cy={cy}
          r={5.5}
          fill={fill}
          stroke="#fff"
          strokeWidth={2}
        />
      </g>
    );
  }
  return (
    <circle
      key={index}
      cx={cx}
      cy={cy}
      r={over ? 5 : 3}
      fill={fill}
      fillOpacity={dimmed ? 0.35 : 1}
      stroke={over ? "#fff" : undefined}
      strokeWidth={over ? 1.5 : undefined}
    />
  );
}

/**
 * Label nilai berbentuk pil berwarna seri, supaya label anggaran & realisasi
 * tidak tertukar. Anggaran di atas titik, realisasi di bawah titik. Label
 * bulan yang tidak dipilih dipudarkan.
 */
function renderPill(
  { x, y, value, index }: LabelProps,
  series: { color: string; labelText: string },
  placement: "above" | "below",
  dimmed: (index: number | undefined) => boolean,
) {
  if (x === undefined || y === undefined || value === undefined) return null;
  const label = formatCompact(Number(value));
  const width = label.length * 5.6 + 10;
  const height = 15;
  const cx = Number(x);
  const top = placement === "above" ? Number(y) - height - 6 : Number(y) + 6;
  return (
    <g opacity={dimmed(index) ? 0.35 : 1}>
      <rect
        x={cx - width / 2}
        y={top}
        width={width}
        height={height}
        rx={7.5}
        fill={series.color}
      />
      <text
        x={cx}
        y={top + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={9.5}
        fontWeight={600}
        fill={series.labelText}
      >
        {label}
      </text>
    </g>
  );
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload?: MonthlyCost }[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const datum = payload?.[0]?.payload;
  if (!active || !datum) return null;
  const over = isOverTarget(datum.realisasi, datum.target);

  const rows = [
    { ...SERIES.target, value: datum.target },
    {
      ...SERIES.realisasi,
      color: over ? OVER_COLOR : SERIES.realisasi.color,
      value: datum.realisasi,
    },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {over && <OverBadge label="Melebihi anggaran" />}
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
              {formatRupiah(row.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-2 text-xs font-semibold">
        <span className="text-slate-600">Serapan</span>
        <SerapanBadge percent={capaian(datum.realisasi, datum.target)} />
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Klik untuk lihat rincian
      </p>
    </div>
  );
}

export function DevelopmentCostTrendChart() {
  const [entity, setEntity] = useState<EntityValue>("HO");
  const [selectedBulan, setSelectedBulan] = useState<string | null>(null);

  const data = developmentCostByEntity[entity];
  const entityLabel =
    ENTITY_OPTIONS.find((option) => option.value === entity)?.label ?? entity;
  const selectedData = data.find((item) => item.bulan === selectedBulan);
  const isDimmed = (index: number | undefined) =>
    selectedBulan !== null &&
    index !== undefined &&
    data[index]?.bulan !== selectedBulan;

  function handleEntityChange(value: EntityValue) {
    setEntity(value);
    setSelectedBulan(null); // rincian bulan lama tidak relevan untuk entity baru
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend
          items={[
            { color: SERIES.target.color, label: SERIES.target.name },
            { color: SERIES.realisasi.color, label: SERIES.realisasi.name },
            { color: OVER_COLOR, label: "Melebihi anggaran" },
          ]}
        />
        <select
          value={entity}
          onChange={(e) => handleEntityChange(e.target.value as EntityValue)}
          aria-label="Pilih entity"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {ENTITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <OverTargetNotice
        subject="anggaran"
        hint="Titik oranye = bulan dengan realisasi di atas anggaran."
        items={data.map((item) => ({
          label: item.bulan,
          realisasi: item.realisasi,
          target: item.target,
        }))}
      />

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 28, right: 24, left: 0, bottom: 10 }}
            style={{ cursor: "pointer" }}
            onClick={(state) => {
              if (state && typeof state.activeLabel === "string") {
                const label = state.activeLabel;
                setSelectedBulan((prev) => (prev === label ? null : label));
              }
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="bulan"
              axisLine={false}
              tickLine={false}
              padding={{ left: 20, right: 20 }}
              tick={highlightTick(selectedBulan)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={formatCompact}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Penanda bulan yang sedang dilihat rinciannya */}
            {selectedBulan && (
              <ReferenceLine
                x={selectedBulan}
                stroke="#0f172a"
                strokeOpacity={0.35}
                strokeWidth={2}
              />
            )}

            <Line
              type="monotone"
              dataKey="target"
              name={SERIES.target.name}
              stroke={SERIES.target.color}
              strokeWidth={2.5}
              dot={(props) =>
                renderDot(props, SERIES.target.color, selectedBulan, false)
              }
              activeDot={{ r: 5 }}
            >
              <LabelList
                dataKey="target"
                content={(props) =>
                  renderPill(props, SERIES.target, "above", isDimmed)
                }
              />
            </Line>
            <Line
              type="monotone"
              dataKey="realisasi"
              name={SERIES.realisasi.name}
              stroke={SERIES.realisasi.color}
              strokeWidth={2.5}
              dot={(props) =>
                renderDot(props, SERIES.realisasi.color, selectedBulan, true)
              }
              activeDot={{ r: 5 }}
            >
              <LabelList
                dataKey="realisasi"
                content={(props) =>
                  renderPill(props, SERIES.realisasi, "below", isDimmed)
                }
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Panel rincian 14 kategori RKAP, muncul kalau ada bulan yang diklik */}
      {selectedData && (
        <BreakdownPanel
          title={`${entityLabel}, ${selectedData.bulan}`}
          items={selectedData.detail}
          onClose={() => setSelectedBulan(null)}
        />
      )}
    </div>
  );
}
