import {
  formatPercent,
  formatRupiah,
  type KategoriRkap,
} from "./dashboardDummyData";
import { OVER_COLOR, OverBadge, OverTargetNotice } from "./overTarget";

// Tinggi baris dikunci supaya area scroll pas menampilkan VISIBLE_ITEMS kategori
const ITEM_HEIGHT = 56;
const GROUP_HEADER_HEIGHT = 32;
const VISIBLE_ITEMS = 7;

const BAR_COLOR = "#3b82f6";

const usage = (item: Pick<KategoriRkap, "anggaran" | "realisasi">) =>
  item.anggaran > 0 ? (item.realisasi / item.anggaran) * 100 : 0;

function CategoryRow({ item, number }: { item: KategoriRkap; number: number }) {
  const percent = usage(item);
  const overBudget = percent > 100;

  return (
    <div
      className="flex flex-col justify-center gap-1"
      style={{ height: ITEM_HEIGHT }}
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        <span
          className="min-w-0 truncate font-medium text-slate-700"
          title={item.name}
        >
          {number}. {item.name}
        </span>
        <span
          className="flex shrink-0 items-center gap-1.5 font-semibold text-slate-700"
          style={overBudget ? { color: OVER_COLOR } : undefined}
        >
          {overBudget && <OverBadge />}
          {formatPercent(percent)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: overBudget ? OVER_COLOR : BAR_COLOR,
          }}
        />
      </div>
      <p className="truncate text-[11px] text-slate-400">
        <span className="font-medium text-slate-600">
          {formatRupiah(item.realisasi)}
        </span>{" "}
        / {formatRupiah(item.anggaran)}
      </p>
    </div>
  );
}

/** Realisasi tiap kategori RKAP terhadap anggarannya; PSDM dikelompokkan */
export function BudgetCategoryList({ data }: { data: KategoriRkap[] }) {
  const psdm = data.filter((item) => item.group === "PSDM");
  const lainnya = data.filter((item) => item.group !== "PSDM");

  const psdmTotal = {
    anggaran: psdm.reduce((sum, item) => sum + item.anggaran, 0),
    realisasi: psdm.reduce((sum, item) => sum + item.realisasi, 0),
  };

  return (
    <>
      <OverTargetNotice
        subject="anggaran"
        items={data.map((item) => ({
          label: item.name,
          realisasi: item.realisasi,
          target: item.anggaran,
        }))}
      />
      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: GROUP_HEADER_HEIGHT + ITEM_HEIGHT * VISIBLE_ITEMS }}
      >
        <div>
          {/* Header grup ikut "menempel" selama sub-kategori PSDM di-scroll */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white text-xs"
            style={{ height: GROUP_HEADER_HEIGHT }}
          >
            <span className="font-bold tracking-wide text-slate-800">PSDM</span>
            <span className="text-[11px] text-slate-400">
              {psdm.length} sub-kategori · {formatPercent(usage(psdmTotal))}
            </span>
          </div>
          <div className="ml-1 border-l-2 border-slate-100 pl-3">
            {psdm.map((item, index) => (
              <CategoryRow key={item.name} item={item} number={index + 1} />
            ))}
          </div>
        </div>

        {lainnya.map((item, index) => (
          <CategoryRow
            key={item.name}
            item={item}
            number={psdm.length + index + 1}
          />
        ))}
      </div>
    </>
  );
}

/** Kartu pendamping: total anggaran RKAP, terpakai, dan sisa yang tersedia */
export function BudgetAvailableSummary({ data }: { data: KategoriRkap[] }) {
  const sum = (items: KategoriRkap[]) => ({
    count: items.length,
    anggaran: items.reduce((total, item) => total + item.anggaran, 0),
    realisasi: items.reduce((total, item) => total + item.realisasi, 0),
  });

  const total = sum(data);
  const sisa = total.anggaran - total.realisasi;
  const percent = usage(total);
  const over = sisa < 0;
  const overStyle = over ? { color: OVER_COLOR } : undefined;

  const groups = [
    { label: "PSDM", ...sum(data.filter((i) => i.group === "PSDM")) },
    {
      label: "Kategori Lainnya",
      ...sum(data.filter((i) => i.group !== "PSDM")),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Total Anggaran RKAP
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {formatRupiah(total.anggaran)}
      </p>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: over ? OVER_COLOR : BAR_COLOR,
          }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
        <span style={overStyle}>Terpakai {formatPercent(percent)}</span>
        {over ? (
          <OverBadge label="Melebihi anggaran" />
        ) : (
          <span>Tersedia {formatPercent(100 - percent)}</span>
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: BAR_COLOR }}
            />
            <span className="text-slate-500">Realisasi</span>
          </div>
          <span className="font-semibold text-slate-800">
            {formatRupiah(total.realisasi)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-100 ring-1 ring-emerald-300" />
            <span className="text-slate-500">
              {over ? "Kelebihan Realisasi" : "Sisa Anggaran Tersedia"}
            </span>
          </div>
          <span className="font-semibold text-emerald-700" style={overStyle}>
            {formatRupiah(Math.abs(sisa))}
          </span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2">
        {groups.map((group) => {
          const groupSisa = group.anggaran - group.realisasi;
          return (
            <div
              key={group.label}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-xs font-semibold text-slate-700">
                {group.label}{" "}
                <span className="font-normal text-slate-400">
                  ({group.count} kategori)
                </span>
              </p>
              <dl className="mt-2 space-y-1 text-[11px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">Anggaran</dt>
                  <dd className="font-medium text-slate-700">
                    {formatRupiah(group.anggaran)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">Realisasi</dt>
                  <dd className="font-medium text-slate-700">
                    {formatRupiah(group.realisasi)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">
                    {groupSisa < 0 ? "Kelebihan" : "Tersedia"}
                  </dt>
                  <dd
                    className="font-semibold text-emerald-700"
                    style={groupSisa < 0 ? { color: OVER_COLOR } : undefined}
                  >
                    {formatRupiah(Math.abs(groupSisa))}
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
