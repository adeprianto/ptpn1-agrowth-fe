import type { ReactNode } from "react";

export interface MiniTableColumn {
  label: string;
  /** Label baris kedua di header, untuk nilai kecil di bawah angka utama */
  sublabel?: string;
  align?: "left" | "right";
  /** Kolom ini mengambil sisa lebar dan teksnya dipotong (…) kalau sempit */
  grow?: boolean;
}

export interface MiniTableRow {
  key: string;
  cells: ReactNode[];
}

interface MiniTableProps {
  columns: MiniTableColumn[];
  rows: MiniTableRow[];
  /** Kalau diisi, tabel di-scroll setelah sekian baris */
  maxRows?: number;
  /** Penjelasan arti tiap kolom, ditampilkan di bawah tabel */
  legend?: { term: string; description: string }[];
}

const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 32;

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
export function MiniTable({ columns, rows, maxRows, legend }: MiniTableProps) {
  return (
    <div>
      <div
        className="overflow-auto rounded-lg border border-slate-200"
        style={
          maxRows
            ? { maxHeight: HEADER_HEIGHT + ROW_HEIGHT * maxRows + 2 }
            : undefined
        }
      >
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr style={{ height: HEADER_HEIGHT }}>
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`border-b border-slate-200 px-1 font-semibold leading-tight xl:px-1.5 text-slate-500 first:pl-2 last:pr-2 ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
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
                className="border-b border-slate-100 last:border-b-0"
                style={{ height: ROW_HEIGHT }}
              >
                {row.cells.map((cell, index) => {
                  const column = columns[index];
                  return (
                    <td
                      key={column?.label ?? index}
                      className={`px-1 tabular-nums xl:px-1.5 text-slate-700 first:pl-2 last:pr-2 ${
                        column?.align === "right"
                          ? "whitespace-nowrap text-right"
                          : "text-left"
                      } ${column?.grow ? "w-full max-w-0" : ""}`}
                    >
                      {column?.grow ? (
                        <div className="truncate">{cell}</div>
                      ) : (
                        cell
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
