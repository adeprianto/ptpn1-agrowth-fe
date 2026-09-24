"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";
import type { ChartTooltipProps } from "./chartTooltip";
import {
  BIAYA_SERIES,
  biayaPerRegional as data,
  formatCompact,
  formatEntityName,
  type BiayaRegionalDatum,
} from "./dashboardDummyData";
import {
  ChartLegend,
  OVER_COLOR,
  OverBadge,
  OverTargetNotice,
  SerapanBadge,
  capaian,
  isOverTarget,
} from "./overTarget";
import { DIMMED_OPACITY, highlightTick } from "./overTargetBarShape";
import { BreakdownPanel } from "./BreakdownPanel";

const COLORS = {
  target: BIAYA_SERIES.target.color,
  realisasi: BIAYA_SERIES.realisasi.color,
};

const formatValue = (value: number) => {
  return `Rp ${value.toLocaleString("id-ID")}`;
};

const formatRegionalLabel = (value: string) => {
  if (value.toUpperCase() === "HO") {
    return "HO";
  }
  return `R${value}`;
};

const formatAxisTick = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = data.find((item) => item.regional === label);
  const over = datum ? isOverTarget(datum.realisasi, datum.target) : false;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-800">
          {formatEntityName(String(label))}
        </p>
        {over && <OverBadge label="Melebihi anggaran" />}
      </div>

      <div className="space-y-1.5">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    over && item.dataKey === "realisasi"
                      ? OVER_COLOR
                      : item.color,
                }}
              />

              <span className="text-slate-500">{item.name}</span>
            </div>

            <span className="font-medium text-slate-800">
              {formatValue(item.value ?? 0)}
            </span>
          </div>
        ))}
      </div>

      {datum && (
        <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-2 text-xs font-semibold">
          <span className="text-slate-600">Serapan anggaran</span>
          <SerapanBadge percent={capaian(datum.realisasi, datum.target)} />
        </div>
      )}
    </div>
  );
}

export function RegionalCostChart() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);

  const selectedData = data.find((item) => item.regional === selectedRegional);

  // Bar entity yang dipilih tetap terang, lainnya dipudarkan. Realisasi yang
  // melebihi anggaran tetap oranye.
  const barShape = (kind: "target" | "realisasi") =>
    function BiayaBar(props: BarShapeProps) {
      const datum = props.payload as BiayaRegionalDatum | undefined;
      const over =
        kind === "realisasi" &&
        datum !== undefined &&
        isOverTarget(datum.realisasi, datum.target);
      const dimmed =
        selectedRegional !== null && datum?.regional !== selectedRegional;
      return (
        <Rectangle
          {...props}
          fill={over ? OVER_COLOR : props.fill}
          fillOpacity={dimmed ? DIMMED_OPACITY : 1}
        />
      );
    };

  return (
    <div className="w-full">
      <OverTargetNotice
        subject="anggaran"
        hint="Bar oranye = realisasi di atas anggaran."
        items={data.map((item) => ({
          label: formatEntityName(item.regional),
          realisasi: item.realisasi,
          target: item.target,
        }))}
      />
      <ChartLegend
        items={[
          { color: COLORS.target, label: BIAYA_SERIES.target.name },
          { color: COLORS.realisasi, label: "Realisasi" },
          { color: OVER_COLOR, label: "Melebihi anggaran" },
        ]}
      />

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="25%"
            margin={{
              top: 20,
              right: 10,
              left: -20,
              bottom: 0,
            }}
            // sesuai bar/kategori yang diklik user
            onClick={(state) => {
              if (state && typeof state.activeLabel === "string") {
                setSelectedRegional((prev) =>
                  prev === state.activeLabel
                    ? null
                    : (state.activeLabel as string),
                );
              }
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#8C8C8C"
            />

            <XAxis
              dataKey="regional"
              axisLine={false}
              tickLine={false}
              tick={highlightTick(selectedRegional, formatRegionalLabel)}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "slate-600",
              }}
              tickFormatter={formatAxisTick}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "#f8fafc",
              }}
            />

            <Bar
              dataKey="target"
              name={BIAYA_SERIES.target.name}
              fill={COLORS.target}
              radius={[0, 0, 0, 0]}
              cursor="pointer"
              shape={barShape("target")}
            >
              <LabelList
                dataKey="target"
                position="top"
                fontSize={10}
                fill="#334155"
                formatter={(value) => formatCompact(Number(value))}
              />
            </Bar>

            <Bar
              dataKey="realisasi"
              name="Realisasi"
              fill={COLORS.realisasi}
              radius={[0, 0, 0, 0]}
              cursor="pointer"
              shape={barShape("realisasi")}
            >
              <LabelList
                dataKey="realisasi"
                position="top"
                fontSize={10}
                fill="#334155"
                formatter={(value) => formatCompact(Number(value))}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Panel rincian, muncul kalau ada regional yang diklik */}
      {selectedData && (
        <BreakdownPanel
          title={formatEntityName(selectedData.regional)}
          items={selectedData.detail}
          onClose={() => setSelectedRegional(null)}
        />
      )}
    </div>
  );
}
