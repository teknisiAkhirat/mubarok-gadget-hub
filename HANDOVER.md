# HANDOVER — Mubarok Gadget Hub

> Dokumen ini adalah titik awal (handover) untuk developer/agent berikutnya.
> Baca `OPENCODE_AGENT_POLICY.md` untuk aturan kerja, dan `README.md` untuk gambaran umum proyek.

---

## 1. Status Terakhir

- **Repo:** `teknisiAkhirat/mubarok-gadget-hub`
- **Branch aktif:** `clean-rebuild` (target merge: `main`)
- **Tahap:** V1 (mock data lokal) selesai & lulus build; backend Cloudflare belum diimplementasikan.
- **Catatan penting:** Arsitektur Supabase telah **dihapus** — V1 memakai mock data + repository lokal. `HANDOFF-JULES.md` masih memuat detail Supabase lama; anggap sudah usang untuk data layer, tapi tetap berguna untuk konteks fitur.

## 2. Verifikasi Terakhir

| Gate               | Hasil  |
| ------------------ | ------ |
| `npm run build`    | LULUS  |
| `npx tsc --noEmit` | LULUS  |
| `npm run lint`     | LULUS  |

## 3. Tech Stack (aktual)

| Layer       | Teknologi                                                            |
| ----------- | -------------------------------------------------------------------- |
| Frontend    | React 19, TypeScript                                                 |
| Routing     | TanStack Router + TanStack Start (file-based routing)                |
| Styling     | Tailwind CSS v4 + shadcn-style UI (`src/components/ui/*`)            |
| Icons/Toast | Lucide icons, Sonner                                                 |
| Data layer  | Mock data (`src/lib/mock-data.ts`), repo lokal (`src/lib/repositories/`) |
| Build       | Vite 7 + Nitro via `@lovable.dev/vite-tanstack-config`, preset Cloudflare |
| Deploy      | Cloudflare Pages (`/.output/public` sebagai output statis)           |

> Supabase = LEGACY. Tujuan akhir: Cloudflare D1 (data), R2 (file), Workers (API).

## 4. Arsitektur Routing

- `src/routes/__root.tsx` — root layout (jaga `<Outlet />`).
- `src/routes/index.tsx` — home / katalog.
- `src/routes/produk.tsx` — daftar produk + filter.
- `src/routes/produk_.$slug.tsx` — detail produk.
- `src/routes/inventory.tsx` — CRUD inventori (barang masuk/stok/jual).
- `src/routes/service-new.tsx` — buat tiket servis (`ssr: false`).
- `src/routes/repair-tracker.tsx` — cari/lacak tiket servis.
- `src/routes/repair-tracker.$ticketId.invoice.tsx` — nota servis printable.
- `src/routes/tukar-tambah.tsx` — estimator trade-in.
- `src/routes/tentang.tsx` — profil toko.
- `src/routes/faq-garansi.tsx` — FAQ & garansi.
- `src/routes/checkout.tsx`, `dashboard.tsx` — halaman pendukung.

`src/routes/README.md` menjelaskan konvensi TanStack; `routeTree.gen.ts` auto-generated (jangan diedit manual).

## 5. Data Layer (V1 — tanpa Supabase)

- `src/lib/mock-data.ts` — source of truth data produk, brand, seller, dll.
- `src/lib/products-db.ts` — CRUD in-memory produk/inventori (fungsi async).
- `src/lib/ticket-store.ts` — state tiket servis.
- `src/lib/repositories/` — repository layer (local storage) untuk tiket.
- `src/lib/service-ticket-types.ts` — tipe & enum status servis
  (`Menunggu`, `Dikerjakan`, `Selesai`, `Gagal`).
- `src/lib/config.server.ts` / `admin-auth.ts` / `format.ts` — helper sisi server/utility.

## 6. Checklist V1

- [x] Homepage
- [x] Katalog + filter produk
- [x] Detail produk
- [x] Pencarian
- [x] Kategori/filter
- [x] WhatsApp CTA
- [x] Tracker servis (tiket, status, nota)
- [x] Inventori
- [x] Tukar tambah (trade-in estimator)
- [x] Halaman tentang
- [x] FAQ/garansi
- [x] Navigasi mobile
- [x] Mock data terstruktur
- [x] Bebas Supabase
- [x] Build produksi lulus
- [x] Lint & typecheck lulus

## 7. TODO List

1. Backend Cloudflare (D1 + R2 + Workers) — ganti mock/local-storage.
2. Auth admin yang aman (role admin / seller-scoped) — saat ini masih longgar.
3. Validasi input Zod pada form inventori & servis.
4. Unit test: minimal flow `service-new` → `repair-tracker`.
5. CI pipeline (build + lint) sebelum merge ke `main`.
6. Mount `StoreInfoCard` ke home atau hapus (saat ini dead code).
7. Sinkronkan CTA WhatsApp dengan satu sumber kebenaran (`waLink`/`mockSeller.whatsapp`) — `Footer` saat ini tidak punya CTA WhatsApp.

## 8. Konvensi & Aturan

- **Branch:** kerja di `clean-rebuild`, jangan langsung sentuh `main`, jangan force push.
- **Commit:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
- **Build gate:** mileston dianggap selesai hanya jika `npm run build` lulus; jalankan `npm run lint` dan `npx tsc --noEmit`.
- **Env/Secret:** jangan commit `.env`/secret/token; jangan cetak token di log.
- **WhatsApp:** satu sumber kebenaran, jangan hard-code URL WhatsApp di komponen.
- **Git remote `origin`:** gunakan format SSH (`git@github.com:...`) untuk keamanan — jangan kembali memakai URL HTTPS yang memuat token.
- **Keamanan:** agent tidak boleh mengakses `~/.ssh` atau kredensial di luar repo (Safety Rail).

## 9. Cara Menjalankan

```bash
npm install
npm run dev      # dev server
npm run build    # build produksi → .output/public
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

## 10. Referensi File

| File                                              | Fungsi                                |
| ------------------------------------------------- | ------------------------------------- |
| `README.md`                                       | Gambaran umum & checklist V1          |
| `OPENCODE_AGENT_POLICY.md`                        | Aturan kerja agent                    |
| `AUDIT_REPORT.md`                                 | Laporan audit/perubahan UI            |
| `src/lib/mock-data.ts`                            | Mock data sumber                     |
| `src/lib/products-db.ts`                          | CRUD produk & inventori               |
| `src/lib/ticket-store.ts`                         | State tiket servis                    |
| `src/lib/repositories/`                           | Repository layer (local storage)      |
| `src/routes/`                                     | Routing aplikasi                      |
| `docs/CHANGELOG.md`                               | Changelog                             |
| `package.json` / `vite.config.ts`                 | Script & config build                 |

---

Siap melanjutkan ke milestone berikutnya (Cloudflare backend + hardening auth).