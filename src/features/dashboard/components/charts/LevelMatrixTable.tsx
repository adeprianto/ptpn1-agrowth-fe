"use client";

import { HeatMatrixTable } from "./HeatMatrixTable";
import {
  ENTITIES,
  LEVELS,
  levelKey,
  levelLabel,
  type Entity,
  type LevelKey,
} from "./dashboardDummyData";

type MatrixRow = { regional: Entity } & Record<LevelKey, number>;

interface LevelMatrixTableProps {
  data: MatrixRow[];
  /** Apa yang dihitung, mis. "peserta" atau "jam pembelajaran" — dipakai di keterangan */
  measure: string;
  /** Satuan nilai, mis. "orang" atau "jam" */
  unit: string;
  /** Warna dasar (rgb "r, g, b") untuk arsiran sel, makin besar makin pekat */
  heatRgb?: string;
}

const ROWS = LEVELS.map((level) => ({
  key: levelKey(level),
  label: levelLabel(level),
}));

const COLUMNS = ENTITIES.map((entity) => ({
  key: entity,
  label: entity === "HO" ? "HO" : `REG ${entity}`,
}));

/** Matriks baris = level BOD-1..6, kolom = HO & regional */
export function LevelMatrixTable({
  data,
  measure,
  unit,
  heatRgb,
}: LevelMatrixTableProps) {
  const byEntity = new Map(data.map((row) => [row.regional, row]));

  return (
    <HeatMatrixTable
      rowHeader="Level"
      rows={ROWS}
      columns={COLUMNS}
      valueOf={(rowKey, columnKey) =>
        byEntity.get(columnKey as Entity)?.[rowKey as LevelKey] ?? 0
      }
      measure={measure}
      unit={unit}
      rowNoun="level BOD"
      columnNoun="HO/regional"
      heatRgb={heatRgb}
    />
  );
}
