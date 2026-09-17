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

interface AnggaranDatum {
  bulan: string;
  rencana: number;
  realisasi: number;
}

// DUMMY DATA — nanti diganti hasil GET /api/v1/organisasi/regional/{id}/anggaran
const data: AnggaranDatum[] = [
  { bulan: "Jan", rencana: 350, realisasi: 180 },
  { bulan: "Feb", rencana: 540, realisasi: 260 },
  { bulan: "Mar", rencana: 190, realisasi: 560 },
  { bulan: "Apr", rencana: 340, realisasi: 190 },
  { bulan: "Mei", rencana: 540, realisasi: 410 },
  { bulan: "Jun", rencana: 580, realisasi: 420 },
  { bulan: "Jul", rencana: 780, realisasi: 500 },
  { bulan: "Agu", rencana: 310, realisasi: 150 },
  { bulan: "Sep", rencana: 540, realisasi: 990 },
  { bulan: "Okt", rencana: 780, realisasi: 260 },
  { bulan: "Nov", rencana: 580, realisasi: 680 },
  { bulan: "Des", rencana: 640, realisasi: 380 },
];

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")} jt`;
}

export function AnggaranPengembanganChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        barGap={4}
        margin={{
          top: 10,
          right: 10,
          left: -30,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#8C8C8C"
        />
        <XAxis
          dataKey="bulan"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 12,
            fill: "slate-600",
          }}
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
        <Bar dataKey="realisasi" fill="#2563EB" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
