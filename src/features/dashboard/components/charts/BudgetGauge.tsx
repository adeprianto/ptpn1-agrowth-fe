"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type BudgetGaugeProps = {
  realisasi: number;
  anggaran: number;
};

const GAUGE_COLOR = "#16a34a";

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const formatPercent = (value: number) =>
  `${value.toFixed(1).replace(".", ",")}%`;

export function BudgetGauge({ realisasi, anggaran }: BudgetGaugeProps) {
  const rawPercentage = anggaran > 0 ? (realisasi / anggaran) * 100 : 0;

  // Arc dikunci 0–100% supaya tidak "meluber" saat over-budget; teks di
  // tengah tetap pakai rawPercentage (bisa >100%) supaya tetap akurat.
  const clampedPercentage = Math.min(Math.max(rawPercentage, 0), 100);

  const chartData = [{ value: clampedPercentage, fill: GAUGE_COLOR }];

  return (
    <div className="w-full">
      {/* Recharts menghitung radius maksimum = min(lebar, tinggi) / 2,
          tidak peduli posisi pusat. Di kotak 2:1 itu = setengah tinggi,
          jadi outerRadius "200%" = tinggi kotak penuh, dan cy "100%"
          menaruh pusat di dasar. */}
      <div className="relative mx-auto aspect-[2/1] w-full max-w-sm">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="150%"
            outerRadius="200%"
            data={chartData}
            startAngle={180}
            endAngle={0}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: "#e2e8f0" }}
              dataKey="value"
              cornerRadius={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-2xl font-bold text-slate-800">
            {formatPercent(rawPercentage)}
          </span>
          <span className="text-[11px] text-slate-400">
            dari anggaran terpakai
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: GAUGE_COLOR }}
            />
            <span className="text-slate-500">Realisasi</span>
          </div>
          <span className="font-semibold text-slate-800">
            {formatRupiah(realisasi)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="text-slate-500">Anggaran</span>
          </div>
          <span className="font-semibold text-slate-800">
            {formatRupiah(anggaran)}
          </span>
        </div>
      </div>
    </div>
  );
}
