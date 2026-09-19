import {Breadcrumb} from "@/components/shared/Breadcrumb";
import {PageHeader} from "@/components/shared/PageHeader";
import Link from "next/link";
import {Plus} from "lucide-react";
import {PelatihanTable} from "@/features/program-pelatihan/components/PelatihanTable";
import {
    dummyDataPelatihanRows
} from "@/features/program-pelatihan/components/programPelatihanDummyData";

export default function PelatihanList() {
    return <div className="space-y-4">
        <Breadcrumb
            items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Program Pelatihan" },
            ]}
        />

        <PageHeader
            title="Program Pelatihan"
            description="Seluruh data program pelatihan pelatihan PTPN 1 di semua regional dan unit"
            action={
                <Link
                    href="/program-pelatihan/create"
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                    <Plus className="h-4 w-4" />
                    Program Pelatihan
                </Link>
            }
        />

        <PelatihanTable rows={dummyDataPelatihanRows} />
    </div>
}
