"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DistribusiDatum {
  name: string;
  value: number;
  color: string;
}

interface DistribusiKaryawanChartProps {
  data: DistribusiDatum[];
}

export function DistribusiKaryawanChart({
  data,
}: DistribusiKaryawanChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs text-slate-500"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
