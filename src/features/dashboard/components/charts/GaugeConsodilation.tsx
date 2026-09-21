"use client";

import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

type BudgetGaugeProps = {
  realisasi?: number;
  anggaran?: number;
};

// Format rupiah penuh & presisi untuk rincian realisasi/anggaran/sisa
const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

// Persentase 1 desimal, koma sesuai format Indonesia
const formatPercent = (value: number) =>
  `${value.toFixed(1).replace(".", ",")}%`;

// Ambang batas status penggunaan anggaran.
// TODO: ini asumsi umum, ganti sesuai kebijakan resmi kalau ada.
function getStatus(percentage: number): { label: string; color: string } {
  if (percentage > 100) return { label: "Melebihi Anggaran", color: "#dc2626" };
  if (percentage >= 90) return { label: "Mendekati Batas", color: "#ef4444" };
  if (percentage >= 75) return { label: "Waspada", color: "#f59e0b" };
  return { label: "Aman", color: "#16a34a" };
}

export function BudgetGauge({
  realisasi = 41_587_199_139,
  anggaran = 49_820_678_300,
}: BudgetGaugeProps) {
  const rawPercentage = anggaran > 0 ? (realisasi / anggaran) * 100 : 0;

  // Arc dikunci maksimal 100% supaya gauge tidak "meluber" saat realisasi
  // melebihi anggaran. Angka teks di tengah tetap pakai rawPercentage
  // (bisa >100%) supaya kondisi over-budget tetap akurat ditampilkan.
  const clampedPercentage = Math.min(Math.max(rawPercentage, 0), 100);
  const status = getStatus(rawPercentage);
  const sisaAnggaran = anggaran - realisasi;

  // Recharts butuh data dalam bentuk array of object, walau cuma 1 nilai
  const chartData = [{ value: clampedPercentage, fill: status.color }];

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-4">
      <div className="relative h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="75%"
            outerRadius="100%"
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            {/* domain [0, 100] wajib di-set manual, karena Recharts tidak
                tahu skala penuh gauge kita adalah persentase 0-100% */}
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

        {/* Overlay teks di tengah gauge — posisi absolute karena
            RadialBarChart tidak punya slot bawaan untuk children di tengah
            seperti PieChart */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-lg font-bold text-slate-800">
            {formatPercent(rawPercentage)}
          </span>
          <span className="text-[11px] text-slate-400">
            dari anggaran terpakai
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: status.color }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Rincian angka: realisasi, anggaran, sisa anggaran */}
      <div className="mt-2 space-y-2 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: status.color }}
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

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-100 ring-1 ring-slate-300" />
            <span className="text-slate-500">Sisa Anggaran</span>
          </div>
          <span className="font-semibold text-slate-800">
            {sisaAnggaran >= 0
              ? formatRupiah(sisaAnggaran)
              : `-${formatRupiah(Math.abs(sisaAnggaran))}`}
          </span>
        </div>
      </div>
    </div>
  );
}
