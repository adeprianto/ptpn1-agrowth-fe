"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface DistribusiDatum {
  name: string;
  value: number;
  color: string;
}

// DUMMY DATA — nama job family masih placeholder "[Posisi Jabatan]" karena
// belum ada daftar job_family resmi. Nanti diganti hasil GET
// /api/v1/organisasi/regional/{id}/distribusi-karyawan
const data: DistribusiDatum[] = [
  { name: "[Posisi Jabatan]", value: 18, color: "#EC4899" },
  { name: "[Posisi Jabatan]", value: 14, color: "#F97316" },
  { name: "[Posisi Jabatan]", value: 20, color: "#10B981" },
  { name: "[Posisi Jabatan]", value: 10, color: "#06B6D4" },
  { name: "[Posisi Jabatan]", value: 12, color: "#3B82F6" },
  { name: "[Posisi Jabatan]", value: 9, color: "#8B5CF6" },
  { name: "[Posisi Jabatan]", value: 11, color: "#EF4444" },
  { name: "[Posisi Jabatan]", value: 6, color: "#EAB308" },
];

export function DistribusiKaryawanChart() {
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

      {/* Legend manual 2 kolom, biar layoutnya match desain
          (Legend bawaan Recharts nggak gampang diatur jadi grid 2 kolom) */}
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
