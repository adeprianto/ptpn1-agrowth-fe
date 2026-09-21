export type CategoryData = {
  name: string;
  value: number;
};

type DevelopmentTypeListProps = {
  data: CategoryData[];
};

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const formatMillions = (value: number) =>
  Math.floor(value / 1_000_000).toLocaleString("id-ID");

export function DevelopmentTypeList({ data }: DevelopmentTypeListProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const formatPercentage = (value: number) =>
    total > 0 ? `${((value / total) * 100).toFixed(1)}%` : "0%";

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const half = Math.ceil(sortedData.length / 2);
  const columns = [sortedData.slice(0, half), sortedData.slice(half)];

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
        <span className="text-sm font-medium text-slate-600">
          Total ({data.length} kategori)
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {formatRupiah(total)}
        </span>
      </div>

      <p className="mb-2 text-right text-[10px] text-slate-400">
        Nilai dalam Juta Rupiah
      </p>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="divide-y divide-slate-100">
            {column.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2 py-2"
              >
                <span
                  className="min-w-0 flex-1 truncate text-xs text-slate-600"
                  title={item.name}
                >
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
