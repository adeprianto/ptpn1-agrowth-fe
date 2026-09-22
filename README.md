# SI Pengembangan SDM — PTPN 1 (Frontend)

Aplikasi Next.js (App Router) untuk Sistem Informasi Pengembangan SDM PTPN 1.

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Salin `.env.example` jadi `.env.local` lalu arahkan `BACKEND_URL` ke backend
Laravel. Variabel ini **tanpa** prefix `NEXT_PUBLIC_` karena hanya dibaca di
sisi server.

Perintah lain:

```bash
npm run build      # build produksi
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Alur data

Browser tidak pernah menembak backend Laravel langsung. Semua permintaan
lewat route handler Next, supaya token sesi bisa disimpan di cookie HttpOnly.

```
Komponen client
   │  apiGet/apiPost/apiPut/apiDelete   ← src/lib/http-client.ts
   ▼
Route handler  src/app/api/**/route.ts
   │  forward(request, "/employees")    ← src/lib/api-client.ts (server-only)
   ▼
Backend Laravel  ${BACKEND_URL}
```

- **`src/lib/api-client.ts`** — jembatan ke Laravel. Membaca cookie lewat
  `next/headers`, jadi **hanya boleh diimpor route handler**.
- **`src/lib/http-client.ts`** — dipakai komponen client. Selalu menembak
  `/api/...`, melempar `ApiError` untuk respons non-2xx (termasuk detail
  validasi 422).
- Menambah endpoint baru = tambah satu file `route.ts` yang memanggil
  `forward()`, lalu satu fungsi di `src/features/<modul>/api/`.

## Struktur folder

```
src/
  app/
    api/**/route.ts        Route handler — satu file per endpoint backend
    (auth)/, (main)/       Halaman; isinya tipis, hanya merender komponen fitur
  lib/
    api-client.ts          Server-only: forward() ke Laravel
    http-client.ts         Client: apiGet/apiPost/... ke /api/**
    cn.ts, format.ts       Helper className dan pemformat angka/tanggal
  types/api/               Wire type: bentuk persis respons backend (snake_case)
  features/<modul>/
    model/<entity>.ts      Model domain (camelCase) + mapper dari wire type
    api/<entity>.ts        Fungsi endpoint; memakai http-client + mapper
    components/            Komponen khusus modul tersebut
  components/
    ui/                    Komponen dasar bebas domain (Button, Field, Modal, …)
    shared/                Komponen lintas modul (Breadcrumb, PageHeader, …)
    shared/data-table/     Tabel berbasis TanStack Table v9
  hooks/                   Hook lintas modul (useAsyncData, useFormSubmit, …)
```

### Wire type vs model domain

`src/types/api` menyimpan bentuk mentah dari backend dan **tidak** dipakai
komponen. Tiap modul punya model domain sendiri plus mapper-nya:

```ts
// src/features/organisasi/model/regional.ts
export interface Regional { id: string; kode: string; nama: string; /* … */ }
export function toRegional(resource: RegionalResource): Regional { /* … */ }
export function toRegionalPayload(input: RegionalInput): RegionalPayload { /* … */ }
```

Kalau bentuk respons backend berubah, yang disentuh cuma wire type dan
mapper-nya — komponen tidak ikut terdampak.

## Tabel

Semua tabel memakai satu komponen: `src/components/shared/data-table`.
Tiga lapis, pilih sesuai kebutuhan.

**1. Susunan bawaan** — toolbar chip filter, tabel, pagination, modal filter:

```tsx
<DataTable config={regionalTableConfig} data={rows} />
```

**2. Konfigurasi yang bisa dipakai ulang.** Tiap modul mengekspor
`create<X>TableConfig()`; konfigurasi yang sama bisa diubah sebagian lewat
`extendTableConfig`:

```tsx
export function createUnitTableConfig(options): TableConfig<Unit> {
  return defineTableConfig<Unit>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-200",
    columns: col.columns([
      rowNumberColumn<Unit>(options.startIndex),
      col.accessor("nama", { header: "Unit", meta: { filter: textFilter("Cari unit...") } }),
      numberColumn<Unit>({ id: "jumlah_karyawan", header: "Karyawan", value: (u) => u.jumlahKaryawan }),
      actionsColumn<Unit>({ actions: (u) => [{ label: "Hapus", onClick: () => hapus(u) }] }),
    ]),
  });
}

// versi ringkas untuk halaman detail
const ringkas = extendTableConfig(unitTableConfig, { density: "compact", showToolbar: false });
```

Kolom siap pakai ada di `columnPresets`: `rowNumberColumn`, `numberColumn`,
`badgeColumn`, `linkColumn`, `titleColumn`, `actionsColumn`. Perilaku per
kolom diatur lewat `meta`: `filter`, `align`, `width`, `nowrap`, `label`.

### Filter

Kolom yang `meta.filter`-nya diisi otomatis mendapat ikon corong di headernya.
Ikon itu membuka `ColumnFilterModal` **untuk kolom itu saja** — satu modal,
satu kolom, satu nilai. Filter kolom lain tidak ikut tersentuh. Chip di
toolbar menampilkan filter yang sedang aktif; klik chip untuk mengubahnya,
klik tanda silang untuk melepasnya.

Ada dua bentuk filter:

```ts
meta: { filter: { type: "text", placeholder: "Cari nama..." } }        // kotak cari
meta: { filter: { type: "options", options: [{ value, label, group? }] } } // checklist
```

`ColumnFilterModal` tidak bergantung pada tabel, jadi bisa dipakai sendiri:

```tsx
const [nama, setNama] = useState<string>();

<ColumnFilterModal
  open={open}
  label="Nama Pegawai"
  config={{ type: "text", placeholder: "Cari nama..." }}
  value={nama}
  onApply={(next) => setNama(next as string | undefined)}  // undefined = filter dihapus
  onClose={() => setOpen(false)}
/>
```

**3. Susunan sendiri** — pakai `DataTableProvider` lalu rangkai sub-komponennya:

```tsx
<DataTableProvider config={config} data={rows} rowCount={total} tableState={tableState}>
  <DataTableToolbar><SearchInput … /></DataTableToolbar>
  <DataTablePaginationBar />
  <DataTableContent />
  <DataTableFilterDialog />
</DataTableProvider>
```

### Mode client vs server

- **Client** — data sudah lengkap di browser. Cukup `<DataTable config data />`;
  sort, filter, dan paging diproses TanStack Table.
- **Server** — API yang memproses. Pakai `useServerDataTable`, lalu teruskan
  `rowCount`, `tableState`, dan `loading`:

```tsx
const { tableState, rows, total, loading, error, refresh, startIndex } =
  useServerDataTable<Unit>({
    defaultSorting: [{ id: "nama", desc: false }],
    fetcher: ({ filters, page, perPage }, signal) =>
      getUnits({ search: filterText(filters.search), page, perPage }, signal)
        .then((res) => ({ rows: res.rows, total: res.meta?.total ?? res.rows.length })),
  });
```

Id kolom sengaja disamakan dengan nama parameter sort/filter di backend,
jadi isi `filters` bisa langsung diteruskan ke fungsi API.

## Hook bersama

| Hook | Kegunaan |
| --- | --- |
| `useAsyncData` | Ambil satu potong data + `loading`/`error`/`refresh`, request dibatalkan otomatis |
| `useServerDataTable` | Sambungkan state tabel (sort/filter/halaman) ke endpoint |
| `useFormSubmit` | Validasi lokal, status menyimpan, dan pemetaan error 422 ke field |
| `useFormValues` | Isi form dari data yang dimuat, tanpa lewat `useEffect` |
| `useTreeExpansion` | Status buka/tutup simpul pohon |
| `useAuth` | User yang sedang login beserta perannya (HO / Regional / Unit) |

## Komponen bersama

- **`components/ui`** — bebas domain: `Alert`, `Badge`, `Button`/`ButtonLink`,
  `Card`, `EmptyState`, `Field`, `Input`/`SearchInput`, `Modal`,
  `SegmentedControl`, `Select`, `Spinner`, `StaticValue`, `Textarea`.
  Jangan menulis ulang kelas Tailwind untuk tombol/isian form — pakai ini.
- **`components/shared`** — sudah tahu konteks aplikasi: `FormPageLayout`
  (kerangka halaman form), `DetailPageState` (status memuat & error halaman
  detail), `TreeExplorer`, `ConfirmDialog`, `Breadcrumb`, `PageHeader`,
  `RowActionMenu`, kartu statistik, dan sebagainya.

## Catatan

Bagian yang masih memakai data dummy diberi komentar `DUMMY` beserta endpoint
yang direncanakan — cari dengan `grep -rn "DUMMY" src/`.
