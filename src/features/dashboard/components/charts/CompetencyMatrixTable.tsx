"use client";

import { useState } from "react";
import { HeatMatrixTable, matrixSelectClass } from "./HeatMatrixTable";
import {
  BIDANG,
  ENTITIES,
  LEVELS,
  formatEntityName,
  jamBidangKonsolidasi,
  jamBidangPerEntity,
  levelKey,
  levelLabel,
  type Bidang,
  type Entity,
  type LevelKey,
} from "./dashboardDummyData";

type Pilihan = Entity | "ALL";

const ROWS = BIDANG.map((bidang) => ({ key: bidang, label: bidang }));
const COLUMNS = LEVELS.map((level) => ({
  key: levelKey(level),
  label: levelLabel(level),
}));

const labelPilihan = (value: Pilihan) =>
  value === "ALL" ? "Seluruh PTPN 1" : formatEntityName(value);

/** Matriks jam pembelajaran: baris = bidang, kolom = level BOD, per entity */
export function CompetencyMatrixTable() {
  const [entity, setEntity] = useState<Pilihan>("ALL");
  const source =
    entity === "ALL" ? jamBidangKonsolidasi : jamBidangPerEntity[entity];

  return (
    <HeatMatrixTable
      rowHeader="Bidang"
      rows={ROWS}
      columns={COLUMNS}
      valueOf={(rowKey, columnKey) =>
        source[rowKey as Bidang][columnKey as LevelKey]
      }
      measure="jam pembelajaran"
      unit="jam"
      rowNoun="bidang"
      columnNoun="level BOD"
      heatRgb="31, 111, 120"
      controls={
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Entitas
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value as Pilihan)}
            className={matrixSelectClass}
          >
            {(["ALL", ...ENTITIES] as Pilihan[]).map((value) => (
              <option key={value} value={value}>
                {labelPilihan(value)}
              </option>
            ))}
          </select>
        </label>
      }
    />
  );
}
