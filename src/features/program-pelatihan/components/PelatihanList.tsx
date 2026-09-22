import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/ui";
import { PelatihanTable } from "./PelatihanTable";
import { dummyDataPelatihanRows } from "./programPelatihanDummyData";

export default function PelatihanList() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Program Pelatihan" },
        ]}
      />

      <PageHeader
        title="Program Pelatihan"
        description="Seluruh data program pelatihan PTPN 1 di semua regional dan unit"
        action={
          <ButtonLink href="/program-pelatihan/create" size="lg" icon={Plus}>
            Program Pelatihan
          </ButtonLink>
        }
      />

      {/* DUMMY — endpoint program pelatihan belum tersedia */}
      <PelatihanTable rows={dummyDataPelatihanRows} />
    </div>
  );
}
