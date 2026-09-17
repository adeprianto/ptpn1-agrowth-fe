import type { LucideIcon } from "lucide-react";
import { PanelCard } from "@/components/shared/PanelCard";

export interface InfoItem {
  icon?: LucideIcon;
  label: string;
  value: string;
}

interface InfoListCardProps {
  title: string;
  items: InfoItem[];
}

export function InfoListCard({ title, items }: InfoListCardProps) {
  return (
    <PanelCard title={title}>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            {item.icon ? (
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
            ) : (
              <span className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <div>
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-medium text-slate-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
