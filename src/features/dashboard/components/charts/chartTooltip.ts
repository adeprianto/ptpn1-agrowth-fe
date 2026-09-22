/**
 * Bentuk data yang dikirim Recharts ke komponen tooltip kustom.
 * Recharts sendiri mengetikkannya sangat longgar, jadi di sini dipersempit
 * ke field yang benar-benar dipakai chart di aplikasi ini.
 */
export interface TooltipEntry {
  /** Nama seri, mis. "Rencana" atau "Realisasi" */
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string | number;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  /** Nilai sumbu X pada titik yang dihover */
  label?: string;
}
