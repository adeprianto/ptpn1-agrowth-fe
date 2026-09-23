import {LucideIcon} from "lucide-react";
import { cn } from "cn";

type LaporanRealisasiCardProp = {
    title: string;
    icon: LucideIcon;
    className?: string;
}

export default function LaporanRealisasiCard({title, className, icon: Icon}: LaporanRealisasiCardProp) {
    return <div className={cn(
        // tampilan
        "rounded-lg border border-slate-300 bg-white p-4",
        // teks
        "text-slate-800",
        className,
    )}>
        <div className="min-w-0 ">
            <h3 className="text-sm font-semibold uppercase text-slate-800">{title}</h3>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-emerald-900">
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
    </div>
}
