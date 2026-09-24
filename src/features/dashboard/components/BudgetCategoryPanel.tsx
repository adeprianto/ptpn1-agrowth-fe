"use client";

import { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import {
  BudgetAvailableSummary,
  BudgetCategoryList,
} from "./charts/BudgetCategoryList";
import {
  ENTITIES,
  formatEntityName,
  kategoriKonsolidasi,
  kategoriPerEntity,
  type Entity,
} from "./charts/dashboardDummyData";

type Pilihan = Entity | "ALL";

const labelPilihan = (value: Pilihan) =>
  value === "ALL" ? "Seluruh PTPN 1" : formatEntityName(value);

/** Kartu 14 kategori RKAP + total anggaran tersedia, keduanya ikut dropdown entity */
export function BudgetCategoryPanel() {
  const [entity, setEntity] = useState<Pilihan>("ALL");
  const data =
    entity === "ALL" ? kategoriKonsolidasi : kategoriPerEntity[entity];

  const select = (
    <select
      value={entity}
      onChange={(e) => setEntity(e.target.value as Pilihan)}
      aria-label="Pilih entitas"
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
    >
      {(["ALL", ...ENTITIES] as Pilihan[]).map((value) => (
        <option key={value} value={value}>
          {labelPilihan(value)}
        </option>
      ))}
    </select>
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DashboardCard
        title={`${data.length} Kategori Biaya RKAP`}
        subtitle={`Realisasi tiap kategori terhadap RKAP — ${labelPilihan(entity)}`}
        headerAction={select}
      >
        <BudgetCategoryList data={data} />
      </DashboardCard>

      <DashboardCard
        title="Total RKAP Tersedia"
        subtitle={`RKAP, realisasi, dan sisa — ${labelPilihan(entity)}`}
        className="flex flex-col"
      >
        <BudgetAvailableSummary data={data} />
      </DashboardCard>
    </div>
  );
}
