"use client";

// Dipisah dari overTarget.tsx karena mengimpor Recharts (client-only),
// sedangkan overTarget.tsx juga dipakai server component.
import { Rectangle, type BarShapeProps } from "recharts";
import { OVER_COLOR } from "./overTarget";

/**
 * `shape` untuk <Bar> realisasi: bar yang melebihi target diwarnai OVER_COLOR.
 * Pengganti <Cell> yang deprecated di Recharts 3.
 */
export function overTargetBarShape(
  isOver: (payload: { target: number; realisasi: number }) => boolean,
) {
  function OverTargetBar(props: BarShapeProps) {
    const over = props.payload ? isOver(props.payload) : false;
    return <Rectangle {...props} fill={over ? OVER_COLOR : props.fill} />;
  }
  return OverTargetBar;
}

/** Opasitas bar yang tidak dipilih, saat ada bar yang sedang diklik */
export const DIMMED_OPACITY = 0.3;

/**
 * Tick sumbu X yang menebalkan kategori terpilih, supaya jelas bar mana
 * yang sedang dilihat rinciannya.
 */
export function highlightTick(
  selected: string | null,
  format: (value: string) => string = (value) => value,
) {
  function HighlightTick(props: {
    x?: number | string;
    y?: number | string;
    payload?: { value?: string | number };
  }) {
    const value = String(props.payload?.value ?? "");
    const active = selected !== null && value === selected;
    return (
      <text
        x={Number(props.x)}
        y={Number(props.y)}
        dy={12}
        textAnchor="middle"
        fontSize={12}
        fontWeight={active ? 700 : 400}
        fill={active ? "#0f172a" : "#475569"}
      >
        {format(value)}
      </text>
    );
  }
  return HighlightTick;
}
