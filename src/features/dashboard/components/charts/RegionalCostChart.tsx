"use client";

import { useState } from "react";
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
import type { ChartTooltipProps } from "./chartTooltip";
import {
  biayaPerRegional as data,
  formatCompact,
  formatEntityName,
  formatPercent,
  type BiayaRegionalDatum,
} from "./dashboardDummyData";
import {
  CapaianValue,
  ChartLegend,
  OVER_COLOR,
  OverBadge,
  OverTargetNotice,
  capaian,
  isOverTarget,
} from "./overTarget";
import { overTargetBarShape } from "./overTargetBarShape";

const COLORS = { target: "#49F150", realisasi: "#2A5432" };
const overShape = overTargetBarShape((d) =>
  isOverTarget(d.realisasi, d.target),
);

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
          <span style={{ color: over ? OVER_COLOR : undefined }}>
            {formatPercent(capaian(datum.realisasi, datum.target))}
          </span>
        </div>
      )}
    </div>
  );
}

/** Rincian per kategori: anggaran vs realisasi, kategori yang lewat ditandai */
function BreakdownPanel({
  datum,
  onClose,
}: {
  datum: BiayaRegionalDatum;
  onClose: () => void;
}) {
  const overCount = datum.detail.filter((item) =>
    isOverTarget(item.realisasi, item.anggaran),
  ).length;

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            Rincian Anggaran & Realisasi — {formatEntityName(datum.regional)}
          </h4>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {datum.detail.length} kategori RKAP
            {overCount > 0 && (
              <span style={{ color: OVER_COLOR }}>
                {" "}
                · {overCount} kategori melebihi anggaran
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Tutup
        </button>
      </div>

      <OverTargetNotice
        subject="anggaran"
        hint="Baris oranye = kategori yang realisasinya di atas anggaran."
        items={datum.detail.map((item) => ({
          label: item.kategori,
          realisasi: item.realisasi,
          target: item.anggaran,
        }))}
      />

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] border-collapse text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Kategori</th>
              <th className="px-3 py-2 text-right font-semibold">Anggaran</th>
              <th className="px-3 py-2 text-right font-semibold">Realisasi</th>
              <th className="px-3 py-2 text-right font-semibold">Serapan</th>
              <th className="px-3 py-2 text-right font-semibold">
                Sisa / Kelebihan
              </th>
            </tr>
          </thead>
          <tbody>
            {datum.detail.map((item) => {
              const over = isOverTarget(item.realisasi, item.anggaran);
              const sisa = item.anggaran - item.realisasi;
              return (
                <tr
                  key={item.kategori}
                  className="border-t border-slate-100 tabular-nums text-slate-700"
                  style={
                    over ? { backgroundColor: `${OVER_COLOR}0f` } : undefined
                  }
                >
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-2">
                      {item.kategori}
                      {over && <OverBadge />}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatValue(item.anggaran)}
                  </td>
                  <td
                    className="px-3 py-2 text-right font-medium"
                    style={over ? { color: OVER_COLOR } : undefined}
                  >
                    {formatValue(item.realisasi)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <CapaianValue
                      percent={capaian(item.realisasi, item.anggaran)}
                    />
                  </td>
                  <td
                    className="px-3 py-2 text-right"
                    style={over ? { color: OVER_COLOR } : undefined}
                  >
                    {over
                      ? `+${formatValue(Math.abs(sisa))}`
                      : formatValue(sisa)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-800">
            <tr className="border-t border-slate-200 tabular-nums">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 text-right">
                {formatValue(datum.target)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatValue(datum.realisasi)}
              </td>
              <td className="px-3 py-2 text-right">
                <CapaianValue
                  percent={capaian(datum.realisasi, datum.target)}
                />
              </td>
              <td
                className="px-3 py-2 text-right"
                style={
                  isOverTarget(datum.realisasi, datum.target)
                    ? { color: OVER_COLOR }
                    : undefined
                }
              >
                {isOverTarget(datum.realisasi, datum.target)
                  ? `+${formatValue(datum.realisasi - datum.target)}`
                  : formatValue(datum.target - datum.realisasi)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-2 text-[10px] text-slate-400">
        <span className="font-semibold text-slate-500">Serapan</span>: realisasi
        dibanding anggaran kategori itu sendiri (▲ = melebihi).{" "}
        <span className="font-semibold text-slate-500">Sisa / Kelebihan</span>:
        anggaran yang tersisa; tanda + oranye berarti realisasi sudah melewati
        anggaran sebesar nilai tersebut.
      </p>
    </div>
  );
}

export function RegionalCostChart() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);

  const selectedData = data.find((item) => item.regional === selectedRegional);

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
          { color: COLORS.target, label: "Target" },
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
              tick={{
                fontSize: 12,
                fill: "slate-600",
              }}
              tickFormatter={formatRegionalLabel}
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
              name="Target"
              fill={COLORS.target}
              radius={[0, 0, 0, 0]}
              cursor="pointer"
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
              shape={overShape}
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
          datum={selectedData}
          onClose={() => setSelectedRegional(null)}
        />
      )}
    </div>
  );
}
