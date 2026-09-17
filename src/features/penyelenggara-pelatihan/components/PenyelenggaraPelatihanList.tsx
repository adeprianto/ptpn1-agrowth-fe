import {Breadcrumb} from "@/components/shared/Breadcrumb";
import {PageHeader} from "@/components/shared/PageHeader";
import Link from "next/link";
import {Boxes, Building2, Factory, Landmark, Plus} from "lucide-react";
import {SummaryStatCard} from "@/components/shared/SummaryStatCard";
import {dummyDataPenyelenggaraRows} from "@/features/penyelenggara-pelatihan/components/penyelenggaraDummyData";
import {PenyelenggaraTable} from "@/features/penyelenggara-pelatihan/components/PenyelenggaraTable";

export default function PenyelenggaraPelatihanList() {
    return <div className="space-y-4">
        <Breadcrumb
            items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Penyelenggara" },
            ]}
        />

        <PageHeader
            title="Penyelenggara"
            description="Seluruh data penyelenggara pelatihan PTPN 1 di semua regional dan unit"
            action={
                <Link
                    href="/penyelenggara-pelatihan/create"
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Penyelenggara
                </Link>
            }
        />

        <PenyelenggaraTable rows={dummyDataPenyelenggaraRows} />

    </div>
}
