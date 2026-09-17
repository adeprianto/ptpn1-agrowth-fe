export function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
      {label} — menyusul
    </div>
  );
}
