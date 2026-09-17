import { MapPin, Phone, User } from "lucide-react";

interface RegionalInfoCardProps {
  penanggungJawab?: string;
  noHp?: string;
  alamatKantor?: string;
  indukOrganisasi: string;
}

export function RegionalInfoCard({
  penanggungJawab,
  noHp,
  alamatKantor,
  indukOrganisasi,
}: RegionalInfoCardProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-300 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">Informasi Regional</h3>

      <div className="mt-4 space-y-3 text-sm text-slate-500">
        <div className="flex items-center gap-2.5">
          <User className="h-4 w-4 shrink-0 text-slate-300" />
          <span>{penanggungJawab || "[Nama penanggung jawab]"}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 shrink-0 text-slate-300" />
          <span>{noHp || "[No HP]"}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
          <span>{alamatKantor || "[Alamat kantor]"}</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Induk Organisasi
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {indukOrganisasi}
        </p>
      </div>

      <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
        Peta lokasi kantor — menyusul
      </div>
    </div>
  );
}
