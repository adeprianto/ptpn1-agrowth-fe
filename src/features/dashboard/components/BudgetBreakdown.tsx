"use client";

import { useState } from "react";
import { MiniTable, Stacked } from "./MiniTable";
import {
  biayaPerRegional,
  formatEntityName,
  formatMiliar,
  formatPercent,
  kategoriKonsolidasi,
} from "./charts/dashboardDummyData";
import { CapaianValue, capaian } from "./charts/overTarget";

type Tab = "entity" | "kategori";

const TABS: { value: Tab; label: string }[] = [
  { value: "entity", label: "Per HO/Regional" },
  { value: "kategori", label: "Per Kategori" },
];

type Row = { name: string; anggaran: number; realisasi: number };

const entityRows: Row[] = biayaPerRegional.map((row) => ({
  name: formatEntityName(row.regional),
  anggaran: row.target,
  realisasi: row.realisasi,
}));

const kategoriRows: Row[] = kategoriKonsolidasi.map((row) => ({
  name: row.group ? `${row.group} - ${row.name}` : row.name,
  anggaran: row.anggaran,
  realisasi: row.realisasi,
}));

/** Rincian realisasi biaya per HO/regional atau per kategori RKAP */
export function BudgetBreakdown() {
  const [tab, setTab] = useState<Tab>("entity");
  const rows = tab === "entity" ? entityRows : kategoriRows;
  const totalRealisasi = rows.reduce((sum, row) => sum + row.realisasi, 0);

  return (
    <div>
      <div className="mb-2 flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            className={`flex-1 rounded-md px-2 py-1 transition-colors ${
              tab === item.value
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <MiniTable
        maxRows={7}
        columns={[
          { label: tab === "entity" ? "Entity" : "Kategori", grow: true },
          { label: "Realisasi", sublabel: "% Real", align: "right" },
          { label: "% RKAP", align: "right" },
        ]}
        rows={rows.map((row) => ({
          key: row.name,
          cells: [
            <span key="name" title={row.name}>
              {row.name}
            </span>,
            <Stacked
              key="real"
              main={formatMiliar(row.realisasi)}
              sub={formatPercent(
                totalRealisasi > 0 ? (row.realisasi / totalRealisasi) * 100 : 0,
              )}
            />,
            <CapaianValue
              key="rkap"
              percent={capaian(row.realisasi, row.anggaran)}
            />,
          ],
        }))}
        legend={[
          {
            term: "% Real",
            description: "porsi terhadap total realisasi konsolidasi",
          },
          {
            term: "% RKAP",
            description: `realisasi dibanding RKAP ${tab === "entity" ? "entity" : "kategori"} itu sendiri (▲ = melebihi)`,
          },
        ]}
      />
    </div>
  );
}
