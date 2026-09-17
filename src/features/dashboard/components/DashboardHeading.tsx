interface DashboardHeadingProps {
  systemName: string;
  description: string;
}

export function DashboardHeading({
  systemName,
  description,
}: DashboardHeadingProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{systemName}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
