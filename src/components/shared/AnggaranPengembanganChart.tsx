"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface AnggaranDatum {
  bulan: string;
  rencana: number;
  realisasi: number;
}

interface AnggaranPengembanganChartProps {
  data: AnggaranDatum[];
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")} jt`;
}

export function AnggaranPengembanganChart({
  data,
}: AnggaranPengembanganChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke="#e2e8f0" />
        <XAxis
          dataKey="bulan"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => formatRupiah(Number(value))}
          contentStyle={{ borderRadius: 12, fontSize: 12 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => (value === "rencana" ? "Rencana" : "Realisasi")}
        />
        <Bar dataKey="rencana" fill="#7E22CE" radius={[0, 0, 0, 0]} />
        <Bar dataKey="realisasi" fill="#256EB" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
