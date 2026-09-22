"use client";

type CategoryData = {
  name: string;
  value: number;
};

const data: CategoryData[] = [
  { name: "PDSM - Pengembangan BOD & BOC", value: 1206502000 },
  { name: "PDSM - Agro Walet", value: 5567910620 },
  { name: "PDSM - IHT & Public Training", value: 2980442462 },
  { name: "PDSM - Kursus Jabatan", value: 3197500000 },
  { name: "PDSM - Sertifikasi Jabatan", value: 2739000000 },
  { name: "PDSM - Program Study Banding", value: 295500000 },
  { name: "PDSM - Program Pendidikan Lanjut", value: 150000000 },
  { name: "PDSM - Biaya Perjalanan Dinas", value: 1738125000 },
  { name: "Assessment", value: 1666681250 },
  { name: "Rekrutmen", value: 3881438023 },
  { name: "Onboarding", value: 6355500000 },
  { name: "Program Budaya Perusahaan", value: 996000000 },
  { name: "Konsultasi Pengembangan SDM", value: 1107549308 },
  { name: "Inovasi & Riset", value: 859672000 },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const formatMillions = (value: number) => {
  const millions = Math.floor(value / 1_000_000);
  return millions.toLocaleString("id-ID");
};

const formatPercentage = (value: number) =>
  `${((value / total) * 100).toFixed(1)}%`;

export function DevelopmentTypeList() {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const leftColumn = sortedData.slice(0, 7);
  const rightColumn = sortedData.slice(7, 14);

  return (
    <div className="w-full">
      {/* Total keseluruhan */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
        <span className="text-sm font-medium text-slate-600">
          Total ({data.length} kategori)
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {formatRupiah(total)}
        </span>
      </div>

      {/* Keterangan satuan, supaya angka "6.355" dkk tidak ambigu */}
      <p className="mb-2 text-right text-[10px] text-slate-400">
        Nilai dalam Juta Rupiah
      </p>

      {/* List 2 kolom: nilai asli (dalam juta) + persentase per kategori */}
      <div className="grid grid-cols-2 gap-x-4">
        {[leftColumn, rightColumn].map((column, colIndex) => (
          <div key={colIndex} className="divide-y divide-slate-100">
            {column.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between gap-2 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-xs text-slate-600">
                  {item.name}
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    {formatMillions(item.value)}
                  </span>

                  <span className="w-10 text-right text-xs font-medium text-slate-400">
                    {formatPercentage(item.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
