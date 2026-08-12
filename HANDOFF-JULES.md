# Handoff: Mubarok Gadget Hub — untuk Jules

> Catatan singkat sebelum mulai kerja: ini adalah repo toko + servis tracker HP bekas yang sudah push ke `origin/main`. Fokus lanjutan adalah inventori dan tracker servis. Bila ada keraguan, tanyakan dulu sebelum mengubah struktur routing atau schema.

---

## 1. Ringkasan Proyek

**Nama repo:** mubarok-gadget-hub  
**Branch utama:** main  
**Remote:** https://github.com/teknisiAkhirat/mubarok-gadget-hub.git  
**Tujuan:** Website katalog + servis tracker untuk toko HP bekas dan sparepart “Mubarok Gadget Hub” (Blora, Jawa Tengah).

Fitur yang sudah ada:

- Katalog produk HP bekas, sparepart, tablet.
- Inventori barang masuk / stok / status penjualan.
- Tracker servis: buat tiket, lacak status servis, cetak nota servis.

---

## 2. Tech Stack

- **Frontend:** React 19 + TypeScript + TanStack Router + TanStack Start.
- **Styling:** Tailwind CSS v4 + UI komponen shadcn-style (`components/ui/*`).
- **Backend / hosting:** Cloudflare Pages static deploy via `.output/public`.
- **Database:** Supabase Postgres.
- **Auth:** Supabase Auth (Google OAuth), halaman login ada di `/admin-login` dan `/auth`.
- **UI lain:** Sonner (toast), Lucide icons.
- **Node:** gunakan Node 20 jika butuh menjalankan tooling lokal (`~/node-v20.11.0-linux-x64/bin`).

Script penting:

- `bun dev` atau `npm run dev` untuk dev server.
- `npm run build` untuk build produksi.
- Hasil build statis ada di `.output/public`.

---

## 3. Struktur Routing Utama

- `src/routes/__root.tsx` — root layout.
- `src/routes/index.tsx` — halaman utama katalog/home.
- `src/routes/produk.tsx` — daftar produk.
- `src/routes/produk_.$slug.tsx` — detail produk.
- `src/routes/inventory.tsx` — modul inventori.
- `src/routes/repair-tracker.tsx` — tracker servis (pencarian tiket).
- `src/routes/repair-tracker.$ticketId.invoice.tsx` — nota servis printable.
- `src/routes/service-new.tsx` — buat tiket servis baru.
- `src/routes/admin-login.tsx` — login admin.
- `src/routes/auth.tsx` — redirect login.
- `src/routes/dashboard.tsx` — dashboard.

Catatan: `service-new` dan `inventory` menggunakan `ssr: false` karena form interaktif.

---

## 4. Database Supabase

### 4.1 Tabel utama yang sudah dipakai

- `products` — inventori barang.
  Kolom penting: `id`, `seller_id`, `type`, `name`, `slug`, `condition`, `condition_label`, `condition_note`, `price`, `cost_price`, `stock`, `imei_or_sn`, `merk`, `tipe`, `sale_status`, `is_active`, `warranty`, `weight`, `images`, `created_at`.

- `service_tickets` — tiket servis.
  Kolom penting: `id`, `ticket_number`, `customer_name`, `customer_phone`, `device_model`, `issue_description`, `diagnosis`, `sparepart_cost`, `service_cost`, `total_cost`, `status`, `notes`, `updated_at`, `created_at`.

### 4.2 Status servis

Pakai enum/value dari `STATUS_ORDER` di `src/lib/service-ticket-types.ts`:

- `Menunggu`
- `Dikerjakan`
- `Selesai`
- `Gagal`

### 4.3 RLS

Tabel `service_tickets` sudah RLS dengan kebijakan:

- `anon` + `authenticated` bisa SELECT/INSERT/UPDATE/DELETE untuk kebutuhan internal/operator.
- Bila ingin bikin auth ketat nanti, bisa diubah sesuai kebutuhan.

### 4.4 Migrasi

Semua migrasi ada di `supabase/migrations/` dengan format `YYYYMMDD...`. File terbaru untuk service tickets:

- `supabase/migrations/20260722220000_004_create_service_tickets.sql.sql`

---

## 5. Kode Penting yang Perlu Diketahui

### Inventori

- `src/routes/inventory.tsx` — CRUD inventori:
  - Tambah/edit barang: `products.insert()` / `products.update()`.
  - Hapus: `products.delete()`.
  - Tandai terjual: set `stock: 0`, `sale_status: "terjual"`, `is_active: false`.
  - Load data: `from("products").select("*").order("created_at", { ascending: false })`.
- `src/lib/products-db.ts` — helper mapping DB row ↔ Product + inventory item.
  - Perhatian: ada helper `inventoryRowToItem()` yang meng-handle nilai null/unknown.

### Tracker Servis

- `src/routes/service-new.tsx` — buat tiket servis.
  - `ticket_number` digenerate sendiri: `SRV-${Date.now().toString().slice(-6)}`.
  - `total_cost` dihitung dari `sparepart_cost + service_cost`.
  - Setelah berhasil, redirect ke `/repair-tracker`.
- `src/routes/repair-tracker.tsx` — cari tiket berdasarkan `ticket_number`.
- `src/routes/repair-tracker.$ticketId.invoice.tsx` — cetak nota servis.

---

## 6. Konvensi & Aturan Kerja

- **Commit message:** gunakan format Conventional Commits, misal `feat: ...`, `fix: ...`, `docs: ...`.
- **Push:** commit lokal dulu, jangan push langsung tanpa review.
- **Branch:** default `main`, kalau perlu fitur besar buat branch baru.
- **Build:** produksi static di `.output/public`. Jangan ubah `.output/server` secara manual.
- **Env:** `.env` lokal dibutuhkan untuk Supabase URL + anon key, tapi jangan commit `.env` ke repo.
- **Deploy:** menggunakan Cloudflare Pages dengan preset Nitro `cloudflare-module`.

---

## 7. Hal yang Masih Perlu Perhatian

- Auth admin masih belum benar-benar ketat di sisi `service_tickets` (saat ini CRUD terbuka untuk anon). Kalau mau amankan untuk publik, pertimbangkan untuk:
  - Batasi akses CRUD hanya untuk authenticated.
  - Tambah policy berbasis `seller_id` atau role admin.
- `service_tickets.status` di frontend dan backend masih bisa kurang sinkron kalau ada perubahan nanti.
- Tidak ada validasi input lanjutan (Zod, dll). Bisa ditambahkan kalau butuh.
- Tidak ada unit test. Kalau ingin, bisa ditambahkan minimal untuk flow `service-new` → `repair-tracker`.

---

## 8. Langkah Cepat Clone & Jalankan

```bash
git clone https://github.com/teknisiAkhirat/mubarok-gadget-hub.git
cd mubarok-gadget-hub
npm install
# buat .env dengan SUPABASE_URL dan SUPABASE_ANON_KEY
npm run dev
```

Untuk build:

```bash
npm run build
# output static ada di .output/public
```

---

## 9. Referensi File Penting

| File                                                                    | Fungsi                                |
| ----------------------------------------------------------------------- | ------------------------------------- |
| `src/routes/inventory.tsx`                                              | Modul inventori                       |
| `src/routes/service-new.tsx`                                            | Form buat tiket servis                |
| `src/routes/repair-tracker.tsx`                                         | Pencarian & status tiket              |
| `src/routes/repair-tracker.$ticketId.invoice.tsx`                       | Nota servis printable                 |
| `src/lib/service-ticket-types.ts`                                       | Tipe + enum status servis             |
| `src/lib/products-db.ts`                                                | Helper mapping produk & inventori     |
| `supabase/migrations/20260722220000_004_create_service_tickets.sql.sql` | Schema service_tickets                |
| `package.json`                                                          | Script & dependency                   |
| `vite.config.ts`                                                        | Config build                          |
| `.output/nitro.json`                                                    | Metadata build untuk Cloudflare Pages |

---

Siap lanjutkan pengembangan.
