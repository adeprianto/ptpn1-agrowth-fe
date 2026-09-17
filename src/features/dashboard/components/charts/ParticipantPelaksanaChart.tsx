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

const data = [
  { regional: "1", target: 100 },
  { regional: "2", target: 158 },
  { regional: "3", target: 160 },
  { regional: "4", target: 175 },
  { regional: "5", target: 33 },
  { regional: "6", target: 31 },
  { regional: "7", target: 70 },
  { regional: "8", target: 165 },
];

const formatValue = (value: number) => {
  return `${value} Orang`;
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
      <p className="mb-2 text-sm font-semibold text-slate-800">
        Regional {label}
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
              {formatValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParticipantPelaksanaChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barCategoryGap="25%"
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
            dataKey="regional"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "slate-600",
            }}
            tickFormatter={(value) => `R${value}`}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "slate-600",
            }}
            tickFormatter={(value) => `${value}`}
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
            name="Peserta"
            fill="#3C758F"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
