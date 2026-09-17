"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { bulan: "Jan", target: 120, realisasi: 100 },
  { bulan: "Feb", target: 140, realisasi: 125 },
  { bulan: "Mar", target: 160, realisasi: 145 },
  { bulan: "Apr", target: 150, realisasi: 135 },
  { bulan: "Mei", target: 180, realisasi: 155 },
  { bulan: "Jun", target: 200, realisasi: 175 },
  { bulan: "Jul", target: 190, realisasi: 185 },
  { bulan: "Agu", target: 220, realisasi: 195 },
  { bulan: "Sep", target: 210, realisasi: 205 },
  { bulan: "Okt", target: 240, realisasi: 215 },
  { bulan: "Nov", target: 250, realisasi: 230 },
  { bulan: "Des", target: 270, realisasi: 250 },
];

const formatValue = (value: number) => {
  return `Rp ${value} Juta`;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">{label}</p>

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
              {formatValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DevelopmentCostTrendChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
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
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#64748b",
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#94a3b8",
            }}
            tickFormatter={(value) => `${value} jt`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#cbd5e1"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 5,
            }}
          />

          <Line
            type="monotone"
            dataKey="realisasi"
            name="Realisasi"
            stroke="#4f46e5"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
