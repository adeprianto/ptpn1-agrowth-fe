import { cn } from "cn";

export type BadgeTone = "slate" | "amber" | "blue" | "emerald" | "rose";

const toneClass: Record<BadgeTone, string> = {
  slate: "bg-slate-100 text-slate-500",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
};

interface StatusBadgeProps {
  tone: BadgeTone;
  label: string;
}

/**
 * Badge status generik — cuma tahu soal WARNA (tone) + TEKS (label).
 * Pemetaan "status apa -> tone apa" jadi tanggung jawab masing-masing
 * fitur (approval Validasi Pelatihan, progress training, target
 * kompetensi, dst), bukan di komponen ini.
 */
export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        // tata letak
        "inline-flex shrink-0 items-center",
        // tampilan
        "rounded-full px-3 py-1",
        // teks
        "text-xs font-medium",
        // warna mengikuti tone
        toneClass[tone],
      )}
    >
      {label}
    </span>
  );
}
