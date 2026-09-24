import type { ReactNode } from "react";

export interface MiniTableColumn {
  label: string;
  /** Label baris kedua di header, untuk nilai kecil di bawah angka utama */
  sublabel?: string;
  align?: "left" | "right" | "center";
  /** Kolom ini mengambil sisa lebar dan teksnya dipotong (…) kalau sempit */
  grow?: boolean;
  /** Judul kolom tidak boleh terlipat */
  nowrap?: boolean;
}

export interface MiniTableRow {
  key: string;
  cells: ReactNode[];
  /** Baris yang bisa diklik, mis. grup PSDM yang dibuka/tutup */
  onClick?: () => void;
  /** Status buka/tutup untuk baris grup (aria-expanded) */
  expanded?: boolean;
  /** Tebalkan baris (mis. baris total grup) */
  emphasis?: boolean;
}

interface MiniTableProps {
  columns: MiniTableColumn[];
  rows: MiniTableRow[];
  /** Kalau diisi, tabel di-scroll setelah sekian baris */
  maxRows?: number;
  /** Penjelasan arti tiap kolom, ditampilkan di bawah tabel */
  legend?: { term: string; description: string }[];
  /** "compact" untuk kartu sempit, "comfortable" untuk kartu lebar */
  size?: "compact" | "comfortable";
}

const SIZES = {
  compact: {
    table: "text-[10px] xl:text-[11px]",
    cell: "px-1 xl:px-1.5 first:pl-2 last:pr-2",
    rowHeight: 36,
    headerHeight: 32,
  },
  comfortable: {
    table: "text-xs",
    cell: "px-3",
    rowHeight: 40,
    headerHeight: 36,
  },
} as const;

const alignClass = (align: MiniTableColumn["align"]) =>
  align === "right"
    ? "text-right"
    : align === "center"
      ? "text-center"
      : "text-left";

/** Angka utama dengan keterangan kecil di bawahnya, dalam satu sel */
export function Stacked({ main, sub }: { main: ReactNode; sub: ReactNode }) {
  return (
    <span className="block leading-tight">
      {main}
      <span className="block text-[10px] text-slate-400">{sub}</span>
    </span>
  );
}

/** Tabel ringkas untuk kartu ringkasan, dengan keterangan kolom */
export function MiniTable({
  columns,
  rows,
  maxRows,
  legend,
  size = "compact",
}: MiniTableProps) {
  const { table, cell, rowHeight, headerHeight } = SIZES[size];

  return (
    <div>
      <div
        className="overflow-auto rounded-lg border border-slate-200"
        style={
          maxRows
            ? { maxHeight: headerHeight + rowHeight * maxRows + 2 }
            : undefined
        }
      >
        <table className={`w-full border-collapse ${table}`}>
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr style={{ height: headerHeight }}>
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`border-b border-slate-200 font-semibold leading-tight text-slate-500 ${cell} ${alignClass(
                    column.align,
                  )} ${column.nowrap ? "whitespace-nowrap" : ""}`}
                >
                  {column.label}
                  {column.sublabel && (
                    <span className="block text-[9px] font-normal text-slate-400">
                      {column.sublabel}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className={`border-b border-slate-100 last:border-b-0 ${
                  row.onClick ? "cursor-pointer hover:bg-slate-50" : ""
                } ${row.emphasis ? "font-semibold" : ""}`}
                style={{ height: rowHeight }}
                onClick={row.onClick}
                aria-expanded={row.expanded}
              >
                {row.cells.map((content, index) => {
                  const column = columns[index];
                  return (
                    <td
                      key={column?.label ?? index}
                      className={`tabular-nums text-slate-700 ${cell} ${alignClass(
                        column?.align,
                      )} ${column?.align && column.align !== "left" ? "whitespace-nowrap" : ""} ${
                        column?.grow ? "w-full max-w-0" : ""
                      }`}
                    >
                      {column?.grow ? (
                        <div className="truncate">{content}</div>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {legend && (
        <dl className="mt-2 space-y-0.5 text-[10px] leading-snug text-slate-400">
          {legend.map((item) => (
            <div key={item.term}>
              <dt className="inline font-semibold text-slate-500">
                {item.term}
              </dt>
              <dd className="inline">: {item.description}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
