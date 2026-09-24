import { GraduationCap } from "lucide-react";

interface DashboardHeadingProps {
  systemName: string;
  description: string;
  /** Label kecil di atas judul */
  eyebrow?: string;
  /** Chip info singkat di bawah deskripsi, mis. tahun anggaran */
  chips?: string[];
}

export function DashboardHeading({
  systemName,
  description,
  eyebrow,
  chips = [],
}: DashboardHeadingProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-950 via-emerald-900 to-emerald-700 px-6 py-7 text-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] sm:px-6">
      {/* Dekorasi: pola titik + lingkaran, sama gaya aksen di kartu lain */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
      >
        <defs>
          <pattern
            id="dashboard-heading-dots"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dashboard-heading-dots)" />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full border-28 border-white/5"
      />

      <div className="relative flex items-start gap-4">
        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur sm:flex">
          <GraduationCap className="h-7 w-7 text-emerald-200" />
        </div>

        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {systemName}
          </h1>
          <p className="mt-2 text-sm text-emerald-100/80">{description}</p>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-emerald-50 ring-1 ring-white/15"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
