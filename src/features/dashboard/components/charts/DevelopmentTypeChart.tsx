"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Pelatihan", value: 45 },
  { name: "Seminar", value: 20 },
  { name: "Sertifikasi", value: 15 },
  { name: "Workshop", value: 12 },
  { name: "Lainnya", value: 8 },
];

const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

const total = data.reduce((sum, item) => sum + item.value, 0);

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: item.payload.fill,
          }}
        />

        <span className="text-sm font-medium text-slate-700">{item.name}</span>
      </div>

      <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}%</p>
    </div>
  );
}

function CenterLabel() {
  return (
    <g>
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-800 text-2xl font-semibold"
      >
        {total}%
      </text>

      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-400 text-xs"
      >
        Total
      </text>
    </g>
  );
}

export function DevelopmentTypeChart() {
  return (
    <div className="w-full">
      {/* Donut */}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((item, index) => (
                <Cell key={item.name} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            <CenterLabel />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span className="truncate text-xs text-slate-600">
                {item.name}
              </span>
            </div>

            <span className="text-xs font-semibold text-slate-800">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
