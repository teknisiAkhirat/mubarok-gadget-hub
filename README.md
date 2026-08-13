# Mubarok Gadget Hub

Website katalog + servis tracker untuk toko HP bekas & sparepart **"Mubarok Gadget Hub"** (Jl. Jatirogo Gg. Wali Songo No. 40, Jepon, Blora — Jawa Tengah).

Tujuan V1: aplikasi stabil, mobile-first, berbasis mock data lokal, tanpa dependensi Supabase, siap di-deploy ke Cloudflare.

## Fitur V1

- Homepage / katalog HP bekas, sparepart, dan tablet
- Detail produk per item
- Pencarian produk
- Filter: harga, brand, kategori, tipe produk
- WhatsApp CTA (satu sumber kebenaran konfigurasi WhatsApp)
- Tracker servis: buat tiket, lacak status, cetak nota servis
- Estimator tukar tambah (trade-in)
- Inventori barang masuk / stok / status penjualan
- Halaman tentang toko & FAQ garansi
- Navigasi mobile-first

## Tech Stack

| Layer       | Teknologi                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| Frontend    | React 19, TypeScript                                                      |
| Routing     | TanStack Router + TanStack Start (file-based routing, `src/routes/`)       |
| Styling     | Tailwind CSS v4, UI komponen shadcn-style (`src/components/ui/*`)          |
| Icons/Toast | Lucide icons, Sonner                                                     |
| Data layer  | Mock data lokal (`src/lib/mock-data.ts`) + repository layer lokal (tanpa Supabase) |
| Build/Deploy| Vite 7 + Nitro (`@lovable.dev/vite-tanstack-config`), preset Cloudflare Pages |
| Runtime     | Node.js (tooling lokal), Bun tersedia sebagai alternatif package manager  |

## Checklist V1

- [x] Homepage (katalog & info toko)
- [x] Katalog produk + filter (harga, brand, kategori)
- [x] Detail produk
- [x] Pencarian produk
- [x] WhatsApp CTA
- [x] Tracker servis (tiket, status, nota/invoice)
- [x] Inventori (tambah / edit / hapus / tandai terjual)
- [x] Estimator tukar tambah
- [x] Halaman tentang
- [x] FAQ & garansi
- [x] Navigasi mobile
- [x] Mock data terstruktur
- [x] Bebas dependensi Supabase
- [x] Build produksi lulus (`npm run build`)
- [x] Lint & typecheck lulus
- [ ] Integrasi backend Cloudflare (D1/R2/Workers)
- [ ] Auth admin yang aman (saat ini policy RLS terbuka / local mock)

## Menjalankan Proyek

```bash
# install dependencies
npm install

# dev server
npm run dev

# production build (output statis di .output/public)
npm run build

# lint
npm run lint
```

> Catatan: `.env` tidak di-commit (lihat `.gitignore`). Salin nilai env yang
> dibutuhkan secara lokal bila diperlukan.

## Struktur Utama

| Path                            | Fungsi                                   |
| ------------------------------- | ---------------------------------------- |
| `src/routes/index.tsx`          | Halaman utama (katalog/home)             |
| `src/routes/produk.tsx`         | Daftar & filter produk                   |
| `src/routes/produk_.$slug.tsx`  | Detail produk                            |
| `src/routes/inventory.tsx`      | Modul inventori                          |
| `src/routes/service-new.tsx`    | Form buat tiket servis                   |
| `src/routes/repair-tracker.tsx` | Lacak tiket servis                       |
| `src/routes/repair-tracker.$ticketId.invoice.tsx` | Nota servis printable   |
| `src/routes/tukar-tambah.tsx`   | Estimator trade-in                       |
| `src/lib/mock-data.ts`          | Data mock terstruktur (produk, seller)   |
| `src/lib/products-db.ts`        | Helper data produk & inventori           |
| `src/lib/ticket-store.ts`       | State tiket servis                       |
| `src/lib/repositories/`         | Repository layer (local storage)         |
| `docs/CHANGELOG.md`             | Changelog                               |

## TODO List

Prioritas lanjutan setelah V1 (mock data):

1. **Backend Cloudflare** — pindahkan data layer ke Cloudflare D1 + R2 + Workers (dari local mock/local storage).
2. **Auth admin** — kunci akses admin & tiket servis (role admin / seller-scoped).
3. **Validasi input** — tambahkan Zod di form inventori & servis.
4. **Unit test** — minimal flow `service-new` → `repair-tracker`.
5. **CI** — tambahkan pipeline build + lint otomatis sebelum merge ke `main`.
6. **Mount `StoreInfoCard`** — pasang ke halaman home atau hapus (kini dead code).
7. **CTA WhatsApp konsisten** — pastikan seluruh halaman memakai sumber kebenaran tunggal `waLink`/`mockSeller.whatsapp`.

## Referensi

- [HANDOVER.md](./HANDOVER.md) — panduan handover untuk developer/agent berikutnya
- [OPENCODE_AGENT_POLICY.md](./OPENCODE_AGENT_POLICY.md) — aturan kerja agent
- [docs/CHANGELOG.md](./docs/CHANGELOG.md) — changelog rilis
