"use client";

import { useState } from "react";
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
import type { ChartTooltipProps } from "./chartTooltip";

// Rincian item yang menyusun angka realisasi suatu regional
type BreakdownItem = {
  kategori: string;
  nilai: number;
};

type RegionalData = {
  regional: string;
  target: number;
  realisasi: number;
  detail: BreakdownItem[];
};

const data: RegionalData[] = [
  {
    regional: "HO",
    target: 37405411840,
    realisasi: 32741820663,
    detail: [
      { kategori: "PDSM - Pengembangan BOD & BOC", nilai: 1206502000 },
      { kategori: "PDSM - Agro Walet", nilai: 5567910620 },
      { kategori: "PDSM - IHT & Public Training", nilai: 2980442462 },
      { kategori: "PDSM - Kursus Jabatan", nilai: 3197500000 },
      { kategori: "PDSM - Sertifikasi Jabatan", nilai: 2739000000 },
      { kategori: "PDSM - Program Study Banding", nilai: 295500000 },
      { kategori: "PDSM - Program Pendidikan Lanjut", nilai: 150000000 },
      { kategori: "PDSM - Biaya Perjalanan Dinas", nilai: 1738125000 },
      { kategori: "Assessment", nilai: 1666681250 },
      { kategori: "Rekrutmen", nilai: 3881438023 },
      { kategori: "Onboarding", nilai: 6355500000 },
      { kategori: "Program Budaya Perusahaan", nilai: 996000000 },
      { kategori: "Konsultasi Pengembangan SDM", nilai: 1107549308 },
      { kategori: "Inovasi & Riset", nilai: 859672000 },
    ],
  },
  {
    regional: "1",
    target: 1500000000,
    realisasi: 627917647,
    detail: [
      { kategori: "Pengembangan BOD & BOC", nilai: 1206502000 },
      { kategori: "Agro Walet", nilai: 45 },
      { kategori: "IHT & Public Training", nilai: 45 },
      { kategori: "Kursus Jabatan", nilai: 45 },
      { kategori: "Sertifikasi Jabatan", nilai: 45 },
      { kategori: "Program Study Banding", nilai: 45 },
      { kategori: "Program Pendidikan Lanjut", nilai: 45 },
      { kategori: "Biaya Perjalanan Dinas", nilai: 45 },
      { kategori: "Assessment", nilai: 45 },
      { kategori: "Rekrutmen", nilai: 45 },
      { kategori: "Onboarding", nilai: 45 },
      { kategori: "Program Budaya Perusahaan", nilai: 45 },
      { kategori: "Konsultasi Pengembangan SDM", nilai: 45 },
      { kategori: "Inovasi & Riset", nilai: 45 },
    ],
  },
  {
    regional: "2",
    target: 2106943750,
    realisasi: 1866943741,
    detail: [
      { kategori: "Pengembangan BOD & BOC", nilai: 1206502000 },
      { kategori: "Agro Walet", nilai: 45 },
      { kategori: "IHT & Public Training", nilai: 45 },
      { kategori: "Kursus Jabatan", nilai: 45 },
      { kategori: "Sertifikasi Jabatan", nilai: 45 },
      { kategori: "Program Study Banding", nilai: 45 },
      { kategori: "Program Pendidikan Lanjut", nilai: 45 },
      { kategori: "Biaya Perjalanan Dinas", nilai: 45 },
      { kategori: "Assessment", nilai: 45 },
      { kategori: "Rekrutmen", nilai: 45 },
      { kategori: "Onboarding", nilai: 45 },
      { kategori: "Program Budaya Perusahaan", nilai: 45 },
      { kategori: "Konsultasi Pengembangan SDM", nilai: 45 },
      { kategori: "Inovasi & Riset", nilai: 45 },
    ],
  },
  {
    regional: "3",
    target: 2260410000,
    realisasi: 1755910000,
    detail: [
      { kategori: "Pengembangan BOD & BOC", nilai: 1206502000 },
      { kategori: "Agro Walet", nilai: 45 },
      { kategori: "IHT & Public Training", nilai: 45 },
      { kategori: "Kursus Jabatan", nilai: 45 },
      { kategori: "Sertifikasi Jabatan", nilai: 45 },
      { kategori: "Program Study Banding", nilai: 45 },
      { kategori: "Program Pendidikan Lanjut", nilai: 45 },
      { kategori: "Biaya Perjalanan Dinas", nilai: 45 },
      { kategori: "Assessment", nilai: 45 },
      { kategori: "Rekrutmen", nilai: 45 },
      { kategori: "Onboarding", nilai: 45 },
      { kategori: "Program Budaya Perusahaan", nilai: 45 },
      { kategori: "Konsultasi Pengembangan SDM", nilai: 45 },
      { kategori: "Inovasi & Riset", nilai: 45 },
    ],
  },
  {
    regional: "5",
    target: 3332941750,
    realisasi: 1791510338,
    detail: [
      { kategori: "Pengembangan BOD & BOC", nilai: 1206502000 },
      { kategori: "Agro Walet", nilai: 45 },
      { kategori: "IHT & Public Training", nilai: 45 },
      { kategori: "Kursus Jabatan", nilai: 45 },
      { kategori: "Sertifikasi Jabatan", nilai: 45 },
      { kategori: "Program Study Banding", nilai: 45 },
      { kategori: "Program Pendidikan Lanjut", nilai: 45 },
      { kategori: "Biaya Perjalanan Dinas", nilai: 45 },
      { kategori: "Assessment", nilai: 45 },
      { kategori: "Rekrutmen", nilai: 45 },
      { kategori: "Onboarding", nilai: 45 },
      { kategori: "Program Budaya Perusahaan", nilai: 45 },
      { kategori: "Konsultasi Pengembangan SDM", nilai: 45 },
      { kategori: "Inovasi & Riset", nilai: 45 },
    ],
  },
  {
    regional: "7",
    target: 2181410960,
    realisasi: 2151421750,
    detail: [
      { kategori: "Pengembangan BOD & BOC", nilai: 1206502000 },
      { kategori: "Agro Walet", nilai: 45 },
      { kategori: "IHT & Public Training", nilai: 45 },
      { kategori: "Kursus Jabatan", nilai: 45 },
      { kategori: "Sertifikasi Jabatan", nilai: 45 },
      { kategori: "Program Study Banding", nilai: 45 },
      { kategori: "Program Pendidikan Lanjut", nilai: 45 },
      { kategori: "Biaya Perjalanan Dinas", nilai: 45 },
      { kategori: "Assessment", nilai: 45 },
      { kategori: "Rekrutmen", nilai: 45 },
      { kategori: "Onboarding", nilai: 45 },
      { kategori: "Program Budaya Perusahaan", nilai: 45 },
      { kategori: "Konsultasi Pengembangan SDM", nilai: 45 },
      { kategori: "Inovasi & Riset", nilai: 45 },
    ],
  },
  {
    regional: "8",
    target: 1033560000,
    realisasi: 651675000,
    detail: [
      { kategori: "Pengembangan BOD & BOC", nilai: 1206502000 },
      { kategori: "Agro Walet", nilai: 45 },
      { kategori: "IHT & Public Training", nilai: 45 },
      { kategori: "Kursus Jabatan", nilai: 45 },
      { kategori: "Sertifikasi Jabatan", nilai: 45 },
      { kategori: "Program Study Banding", nilai: 45 },
      { kategori: "Program Pendidikan Lanjut", nilai: 45 },
      { kategori: "Biaya Perjalanan Dinas", nilai: 45 },
      { kategori: "Assessment", nilai: 45 },
      { kategori: "Rekrutmen", nilai: 45 },
      { kategori: "Onboarding", nilai: 45 },
      { kategori: "Program Budaya Perusahaan", nilai: 45 },
      { kategori: "Konsultasi Pengembangan SDM", nilai: 45 },
      { kategori: "Inovasi & Riset", nilai: 45 },
    ],
  },
];

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

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">
        {label === "HO" ? "Head Office" : `Regional ${label}`}
      </p>

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
                  backgroundColor: item.color,
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
    </div>
  );
}

export function RegionalCostChart() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);

  const selectedData = data.find((item) => item.regional === selectedRegional);

  return (
    <div className="w-full">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="25%"
            margin={{
              top: 10,
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

            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="target"
              name="Target"
              fill="#49F150"
              radius={[0, 0, 0, 0]}
              cursor="pointer"
            />

            <Bar
              dataKey="realisasi"
              name="Realisasi"
              fill="#2A5432"
              radius={[0, 0, 0, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Panel rincian, muncul kalau ada regional yang diklik */}
      {selectedData && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">
              Rincian Realisasi —{" "}
              {selectedData.regional === "HO"
                ? "Head Office"
                : `Regional ${selectedData.regional}`}
            </h4>

            <button
              type="button"
              onClick={() => setSelectedRegional(null)}
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
