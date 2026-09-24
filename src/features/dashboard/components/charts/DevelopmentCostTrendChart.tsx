"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LabelList,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type DotItemDotProps,
} from "recharts";
import {
  ENTITY_OPTIONS,
  developmentCostByEntity,
  type EntityValue,
} from "./developmentCostDummyData";
import { OVER_COLOR, OverTargetNotice, isOverTarget } from "./overTarget";

// Titik oranye hanya di bulan yang realisasinya melebihi target
function OverTargetDot({ cx, cy, payload, index }: DotItemDotProps) {
  if (!payload || !isOverTarget(payload.realisasi, payload.target)) {
    return <g key={index} />;
  }
  return (
    <circle
      key={index}
      cx={cx}
      cy={cy}
      r={5}
      fill={OVER_COLOR}
      stroke="#fff"
      strokeWidth={1.5}
    />
  );
}

const formatValue = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const formatAxisTick = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);

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

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">{label}</p>
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
              {formatValue(Number(item.value))}
            </span>
          </div>
        ))}
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

  function handleEntityChange(value: EntityValue) {
    setEntity(value);
    setSelectedBulan(null); // rincian bulan lama tidak relevan untuk entity baru
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-end">
        <select
          value={entity}
          onChange={(e) => handleEntityChange(e.target.value as EntityValue)}
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
        subject="target"
        hint="Titik oranye = bulan dengan realisasi di atas target."
        items={data.map((item) => ({
          label: item.bulan,
          realisasi: item.realisasi,
          target: item.target,
        }))}
      />

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
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
              stroke="#8C8C8C"
            />
            <XAxis
              dataKey="bulan"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={formatAxisTick}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />

            {/* Penanda bulan yang sedang dilihat rinciannya */}
            {selectedBulan && (
              <ReferenceLine
                x={selectedBulan}
                stroke="#10b981"
                strokeDasharray="4 4"
              />
            )}

            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#cbd5e1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="realisasi"
              name="Realisasi"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={OverTargetDot}
              activeDot={{ r: 5 }}
            >
              <LabelList
                dataKey="realisasi"
                position="top"
                fontSize={10}
                fill="#334155"
                offset={8}
                formatter={(value) => formatAxisTick(Number(value))}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Panel rincian 14 kategori RKAP, muncul kalau ada bulan yang diklik */}
      {selectedData && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">
              Rincian Realisasi — {entityLabel}, {selectedData.bulan}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedBulan(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Tutup
            </button>
          </div>

          <div className="space-y-2">
            {selectedData.detail.map((item) => (
              <div
                key={item.kategori}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-500">{item.kategori}</span>
                <span className="font-medium text-slate-800">
                  {formatValue(item.nilai)}
                </span>
              </div>
            ))}

            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs font-semibold">
              <span className="text-slate-600">Total Realisasi</span>
              <span className="text-slate-800">
                {formatValue(selectedData.realisasi)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
