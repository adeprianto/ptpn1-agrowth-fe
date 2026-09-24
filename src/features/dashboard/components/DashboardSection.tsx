import type { ReactNode } from "react";

interface DashboardSectionProps {
  /** Label kecil di atas judul, mis. "Overview" */
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardSection({
  eyebrow,
  title,
  description,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-green-600">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
