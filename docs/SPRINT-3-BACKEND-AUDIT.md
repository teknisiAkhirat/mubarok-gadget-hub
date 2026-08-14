# SPRINT 3 — Backend Architecture Audit & Cloudflare D1 Schema Design

> **Status:** AUDIT & DESIGN ONLY — tidak ada perubahan source code, tidak ada provisioning Cloudflare, tidak ada pembuatan tabel D1, tidak ada deployment, tidak ada perubahan credential/env.
> **Tanggal:** 13 Agustus 2026
> **Oleh:** Hermes Agent (Lead Developer AI Agent)
> **Referensi aktual:** implementasi Sprint 1 + Sprint 2 (file `src/lib/*`, `src/routes/*`, `src/components/*`), `blueprint.md`, `src/lib/schemas.ts`.

---

## 1. Executive Summary

Repository Mubarok Gadget Hub saat ini **sepenuhnya berbasis mock data + localStorage**. Tidak ada backend sungguhan. Namun, arsitektur sudah dipersiapkan dengan baik untuk migrasi:

- **Repository pattern** sudah ada (`src/lib/repositories/`) dengan interface `ProductRepository` dan `TicketRepository`, serta satu titik masuk (`index.ts`) tempat implementasi backend baru cukup di-swap.
- **Zod schemas** sudah ada (`src/lib/schemas.ts`) untuk validasi form — ini *validation boundary* yang ideal untuk backend.
- **Type definitions** untuk `Product`, `Ticket`, `InventoryItem`, `Order`, `TradeIn` sudah terbentuk dari kode aktual.

Temuan kunci:
1. Data persisten saat ini = localStorage keys: `mubarok_products`, `mubarok_service_tickets`, `mubarok_cart`, `mubarok_orders`, `mubarok_checkout_draft`.
2. Mock data statis (`mockProducts`, `mockBrands`, `mockCategories`, `mockSeller`) di `mock-data.ts` — ini "reference data" (brand/model/category) yang perlu dimasukkan ke D1 sebagai tabel lookup.
3. Form yang menghasilkan data: `inventory.tsx` (InventoryItem), `service-new.tsx` (Ticket), `tukar-tambah.tsx` (TradeIn — saat ini hanya kirim WhatsApp, **belum persist**).
4. Trust model (Inspection Report, Grade, Riwayat Unit) menurut `blueprint.md` Section 5 sudah sebagian terwujud di `Product` type (`inspection`, `grade`, `defects`, `conditionNote`) — sudah cukup untuk V1 tanpa pemisahan product/physical-unit yang rumit.

**Rekomendasi V1:** Migrasi bertahap dengan D1 sebagai single source of truth, Cloudflare Workers sebagai API layer, R2 untuk foto unit. Jangan over-engineer (sesuai prinsip "Sederhana" & "Bertahap" di blueprint).

---

## 2. Current Data Architecture

### 2.1 Sumber Data Saat Ini

| Sumber | Lokasi | Jenis | Persistence | Status |
|---|---|---|---|---|
| `mockProducts` | `src/lib/mock-data.ts` | Array statis `Product[]` | Tidak (hardcode) | Seed data produk |
| `mockBrands` | `src/lib/mock-data.ts` | Array statis `PhoneBrand[]` | Tidak | Lookup merek+model |
| `mockCategories` | `src/lib/mock-data.ts` | Array statis `SparePartCategory[]` | Tidak | Lookup kategori sparepart |
| `mockSeller` | `src/lib/mock-data.ts` | Objek `Seller` | Tidak | Info toko tunggal |
| `LocalStorageProductRepository` | `src/lib/repositories/local-storage-product-repository.ts` | CRUD produk | localStorage `mubarok_products` | Aktif (default repo) |
| `LocalStorageTicketRepository` | `src/lib/repositories/local-storage-ticket-repository.ts` | CRUD tiket servis | localStorage `mubarok_service_tickets` | Aktif (default repo) |
| `cart-store.tsx` | `src/lib/cart-store.tsx` | Cart context | localStorage `mubarok_cart` | Aktif (client-only) |
| `order-store.ts` | `src/lib/order-store.ts` | Order CRUD | localStorage `mubarok_orders` | Aktif |
| `checkout-store.ts` | `src/lib/checkout-store.ts` | Checkout draft | localStorage `mubarok_checkout_draft` | Aktif (client-only) |

### 2.2 API Abstraction Layer (sudah ada)

```
src/lib/repositories/
├── index.ts                              ← SINGLE ENTRY POINT (swap di sini)
├── product-repository.ts                 ← interface ProductRepository
├── local-storage-product-repository.ts   ← impl saat ini
├── ticket-repository.ts                  ← interface TicketRepository
└── local-storage-ticket-repository.ts    ← impl saat ini
```

`index.ts` saat ini:
```ts
export const ticketRepository = new LocalStorageTicketRepository();
export const productRepository = new LocalStorageProductRepository();
```

**Ini adalah titik migrasi paling kritis.** Untuk backend D1, cukup ganti baris ini dengan `new D1ProductRepository(env.DB)` dan `new D1TicketRepository(env.DB)`.
(NB: `products-db.ts` juga punya helper `fetchProducts`/`insertProduct`/`inventoryRowToItem` — ini sudah setengah jalan menuju D1 row mapping.)

### 2.3 State Management

- **Zustand-like Context** untuk cart (`cart-store.tsx` — pakai React Context + useState, bukan Zustand library).
- Order & checkout: module function + localStorage langsung (bukan context).
- Tidak ada server state (tanpa React Query / SWR). Semua di-client.

### 2.4 Data yang HANYA UI/Mock (belum perlu DB di V1)

- `mockSeller` → toko tunggal, bisa jadi 1 row di `sellers` tapi bisa juga hardcode env untuk V1.
- `rating`, `reviewCount`, `soldCount` di `Product` → saat ini mock angka; V1 bisa simpan sebagai field biasa (diisi manual admin), belum perlu tabel reviews terpisah.
- `StoreInfoCard` / `Footer` → info kontak statis, bukan entity DB.

---

## 3. Entity Map (dari kode aktual)

### 3.1 Entities yang SUDAH dipakai aplikasi

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│ phone_brands    │ 1   N │ phone_models     │  N  1 │ products        │
│ (mockBrands)    │──────▶│ (brand.models)   │◀──────│ (brandId,       │
└─────────────────┘       └──────────────────┘       │  modelId)       │
                                                     └────────┬────────┘
                                                              │ 1   N
                                                              ▼
                                                     ┌──────────────────┐
                                                     │ sparepart_categories
                                                     │ (mockCategories) │
                                                     └──────────────────┘

products (Product)
  ├── 1 N ──▶ product_images (R2 keys)
  ├── 1 N ──▶ inspections (label, status, note)   [dari Product.inspection]
  ├── 1 N ──▶ product_defects (text)              [dari Product.defects]
  └── N 1 ──▶ sellers (sellerId)                  [dari Product.sellerId]

service_tickets (Ticket)            ← independent entity, no FK ke product saat ini
trade_ins (TradeIn)                 ← form-only saat ini (WhatsApp), belum persist
orders (Order)                      ← dari order-store, refer productId (string)
order_items (OrderItem)             ← embedded di Order.items
inventory_items (InventoryItem)     ← dari inventory.tsx, overlap dgn products
```

### 3.2 Relasi Aktual (bukan asumsi)

| Relasi | Bukti di kode | Keputusan V1 |
|---|---|---|
| `Product.brandId` → `PhoneBrand.id` | `mock-data.ts` | FK ke `brands` |
| `Product.modelId` → `PhoneModel.id` | `mock-data.ts` | FK ke `phone_models` |
| `Product.categoryId` → `SparePartCategory.id` | `mock-data.ts` (null untuk hp-bekas) | FK nullable ke `sparepart_categories` |
| `Product.sellerId` → `Seller.id` | `mock-data.ts` | FK ke `sellers` (atau hardcode V1) |
| `Product.inspection[]` → InspectionItem | `mock-data.ts` | pecah ke `product_inspections` |
| `Product.defects[]` → string | `mock-data.ts` | pecah ke `product_defects` |
| `Product.images[]` → string (path/URL) | `mock-data.ts` | pecah ke `product_images` (R2 key) |
| `Ticket` → `Product` | **TIDAK ADA** di kode | OPEN DECISION: perlu link tiket ke unit? |
| `Order.items[].productId` → `Product.id` | `order-store.ts` | reference by ID (tidak wajib FK strict V1) |
| `InventoryItem` vs `Product` | `inventory.tsx` vs `mock-data.ts` | OVERLAP — lihat §3.3 |

### 3.3 Konflik / Duplikasi yang Perlu Diputuskan

**`InventoryItem` (inventory.tsx) vs `Product` (mock-data.ts):**
- `InventoryItem` punya field `imei_or_sn`, `cost_price`, `sale_status`, `merk`, `tipe` yang TIDAK ada di `Product`.
- `Product` punya `grade`, `defects`, `inspection`, `brandId`, `modelId`, `slug` yang tidak semua ada di `InventoryItem`.
- **Keduanya mendeskripsikan "barang yang dijual"**. Di V1, disarankan **gabungkan menjadi satu tabel `products`** dengan kolom tambahan (`imei_or_sn`, `cost_price`, `sale_status`) — jangan buat 2 tabel terpisah. Inventory page bisa menjadi admin-view dari `products` dengan filter `type`.

> ⚠️ OPEN DECISION: Apakah `inventory.tsx` merupakan admin-manage produk (sama table) atau memang entitas fisik berbeda (stock opname vs listing)? Blueprint §5 menyebut "Riwayat Unit" dengan ID internal `MGH-SAM-S23-00017` — ini mengisyaratkan pemisahan **product (listing)** vs **physical_unit (barang fisik)** di masa depan, TAPI bukan untuk V1 (lihat §6).

---

## 4. Cloudflare Architecture

### 4.1 Topologi

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (React + Vite + TanStack Router) — static di Cloudflare │
│  Pages: /, /produk, /produk/$slug, /servis, /tukar-tambah,        │
│        /admin/katalog, /admin/servis, /inventory, /dashboard     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ fetch() ke /api/*
                            │ (OpenAI-style bukan, ini REST)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Cloudflare Worker (api) — Hono atau plain Worker               │
│  - Auth: admin route guard (JWT/session cookie dari auth login)  │
│  - Validation: Zod (reuse src/lib/schemas.ts)                    │
│  - Mapping: rows <-> types                                       │
│  - R2 binding untuk upload foto                                  │
└───────┬───────────────────────────────┬──────────────────────────┘
        │                                │
        ▼                                ▼
┌──────────────┐                 ┌──────────────────┐
│  D1 (SQLite) │                 │  R2 Bucket       │
│  products,    │                 │  foto unit HP,   │
│  tickets,     │                 │  foto servis,    │
│  trade_ins,   │                 │  dokumentasi     │
│  orders, dll  │                 │                  │
└──────────────┘                 └──────────────────┘
```

### 4.2 Boundary Frontend / Backend

| Concern | Frontend | Backend (Worker) |
|---|---|---|
| Render UI | ✅ | ❌ |
| Form validation (UX) | ✅ Zod di client | ✅ Zod di server (authoritative) |
| Auth session | simpan token/cookie | issue & verify |
| CRUD produk/tiket | panggil `/api/*` | eksekusi ke D1 |
| Upload foto | presign / direct ke Worker | teruskan ke R2 |
| Business logic | ❌ | ✅ |
| Pricing | tampilkan | sumber harga di D1 |

### 4.3 Endpoint API yang Diperlukan (V1 minimum)

Lihat §7 untuk detail contract.

### 4.4 Resource Ownership

- **D1**: single database `mubarok_db` (bisa per-environment: `mubarok_db_dev`, `mubarok_db_prod`).
- **R2**: single bucket `mubarok-media` (prefix per-environment: `dev/`, `prod/`).
- **Worker**: 1 script `mubarok-api` (bisa duplikasi per env via wrangler environments).

### 4.5 Error Handling

- Standard response: `{ error: { code, message, fields? } }` untuk 4xx/5xx.
- 400 = validation gagal (Zod error di-map ke `fields`).
- 401 = tidak auth (admin route).
- 404 = entity tidak ditemukan.
- 409 = conflict (slug duplikat, ticket_number duplikat).
- 500 = unexpected (log ke Worker error, jangan bocorkan stack ke client).

### 4.6 Validation Boundary

- **Client**: Zod di `src/lib/schemas.ts` untuk UX cepat (sudah ada).
- **Server**: SAME Zod schema diimpor ke Worker (bundle via esbuild/wrangler). Ini mencegah duplikasi logic.
- Jangan percaya client — semua input divalidasi ulang di server.

### 4.7 Upload File / Image ke R2

- Frontend kirim file ke `POST /api/media/upload` (multipart) ATAU dapatkan presigned URL.
- Worker validasi: tipe (jpg/png/webp), max size (misal 5MB), max count.
- Worker upload ke R2 dengan key `env/prefix/{uuid}.{ext}`.
- Worker balas `{ key, url }`; frontend simpan `key` ke D1 (field `product_images` / `media` table).

### 4.8 URL/File Metadata di D1

- D1 hanya simpan **R2 key** (bukan full URL). URL dibentuk di runtime dari `R2_PUBLIC_URL` + key.
- Atau simpan di tabel `media` (`id, owner_type, owner_id, r2_key, content_type, size, created_at`) untuk relasi fleksibel.

### 4.9 Environment dev/staging/prod

| Env | D1 | R2 prefix | Worker route |
|---|---|---|---|
| dev | `mubarok_db_dev` | `dev/` | `api-dev.mubarok.dev` |
| staging | `mubarok_db_staging` | `staging/` | `api-staging.mubarok.id` |
| prod | `mubarok_db_prod` | `prod/` | `api.mubarok.id` |

Gunakan `wrangler.toml` `[env.dev]`, `[env.prod]` sections. Jangan share DB antar env.

---

## 5. D1 Schema Proposal

> Semua tabel pakai `TEXT` untuk UUID/string, `INTEGER` untuk angka & timestamp (Unix epoch ms disarankan untuk D1 kompatibilitas), `REAL` untuk harga (atau INTEGER sen untuk hindari float — **RECOMMENDED: simpan harga dalam sen, INTEGER**).
> `created_at` / `updated_at` = `INTEGER` (epoch ms) dengan default `strftime('%s','now')*1000`.

### 5.1 `brands`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | "brand-samsung" |
| name | TEXT | NOT NULL | "Samsung" |
| slug | TEXT | NOT NULL, UNIQUE | "samsung" |
| logo | TEXT | NULL | path R2 (opsional V1) |

**Alasan:** dari `mockBrands`. Lookup merek.

### 5.2 `phone_models`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | "sam-m52" |
| brand_id | TEXT | NOT NULL, FK→brands(id) | |
| name | TEXT | NOT NULL | "Galaxy M52" |
| slug | TEXT | NOT NULL, UNIQUE | "galaxy-m52" |
| release_year | INTEGER | NULL | 2021 |

**Alasan:** dari `mockBrands[].models`.

### 5.3 `sparepart_categories`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | "cat-lcd" |
| name | TEXT | NOT NULL | |
| slug | TEXT | NOT NULL, UNIQUE | |
| icon | TEXT | NULL | emoji (V1) |
| description | TEXT | NULL | |

**Alasan:** dari `mockCategories`.

### 5.4 `sellers`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | "seller-mubarok" |
| store_name | TEXT | NOT NULL | |
| slug | TEXT | NOT NULL, UNIQUE | |
| owner_name | TEXT | NULL | |
| city | TEXT | NULL | |
| whatsapp | TEXT | NULL | |
| is_verified | INTEGER | NOT NULL DEFAULT 0 | boolean (0/1) |
| description | TEXT | NULL | |
| operational_hours | TEXT | NULL | |

**Alasan:** dari `mockSeller`. V1 bisa 1 row saja (single store).

### 5.5 `products` (gabungan Product + InventoryItem)

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | "hp-001" / uuid |
| seller_id | TEXT | NOT NULL, FK→sellers(id) | |
| type | TEXT | NOT NULL | 'hp-bekas'\|'sparepart'\|'tablet' |
| name | TEXT | NOT NULL | |
| slug | TEXT | NOT NULL, UNIQUE | |
| brand_id | TEXT | NULL, FK→brands(id) | |
| model_id | TEXT | NULL, FK→phone_models(id) | |
| category_id | TEXT | NULL, FK→sparepart_categories(id) | null untuk hp-bekas |
| condition | TEXT | NOT NULL | 'mulus'\|'normal'\|'ori-copotan'\|'compatible' |
| condition_label | TEXT | NOT NULL | "Normal" |
| condition_note | TEXT | NOT NULL DEFAULT '' | **AMANAH: wajib diisi** |
| grade | TEXT | NULL | 'A'\|'B+'\|'B'\|'C' |
| description | TEXT | NOT NULL DEFAULT '' | |
| specifications | TEXT | NOT NULL DEFAULT '{}' | JSON string (Record<string,string>) |
| price | INTEGER | NOT NULL | dalam sen (price*100) |
| compare_at_price | INTEGER | NULL | sen |
| cost_price | INTEGER | NULL | sen (dari InventoryItem) |
| imei_or_sn | TEXT | NULL | dari InventoryItem |
| stock | INTEGER | NOT NULL DEFAULT 0 | |
| sale_status | TEXT | NULL | 'tersedia'\|'terjual'\|'pending' (dari InventoryItem) |
| warranty | TEXT | NOT NULL DEFAULT '' | |
| weight | INTEGER | NOT NULL DEFAULT 300 | gram |
| rating | REAL | NOT NULL DEFAULT 0 | |
| review_count | INTEGER | NOT NULL DEFAULT 0 | |
| sold_count | INTEGER | NOT NULL DEFAULT 0 | |
| is_featured | INTEGER | NOT NULL DEFAULT 0 | |
| is_active | INTEGER | NOT NULL DEFAULT 1 | |
| compatible_with | TEXT | NOT NULL DEFAULT '[]' | JSON array (sparepart) |
| tags | TEXT | NOT NULL DEFAULT '[]' | JSON array |
| created_at | INTEGER | NOT NULL DEFAULT (epoch) | |
| updated_at | INTEGER | NOT NULL DEFAULT (epoch) | |

**Index:** `idx_products_type` (type), `idx_products_brand` (brand_id), `idx_products_active` (is_active), `idx_products_slug` UNIQUE(slug).
**Alasan:** gabung Product + InventoryItem (lihat §3.3). Field `imei_or_sn`, `cost_price`, `sale_status` diambil dari `InventoryItem`.

### 5.6 `product_defects`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | uuid |
| product_id | TEXT | NOT NULL, FK→products(id) ON DELETE CASCADE | |
| defect_text | TEXT | NOT NULL | "Frame kanan gores ringan" |

**Alasan:** pecah dari `Product.defects[]`. Transparansi cacat — core trust.

### 5.7 `product_inspections`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | uuid |
| product_id | TEXT | NOT NULL, FK→products(id) ON DELETE CASCADE | |
| label | TEXT | NOT NULL | "Layar" |
| status | TEXT | NOT NULL | 'Normal'\|'Minus' |
| note | TEXT | NULL | |

**Alasan:** pecah dari `Product.inspection[]`. Inspection Report (blueprint §5).

### 5.8 `product_images` (atau `media`)

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | uuid |
| product_id | TEXT | NOT NULL, FK→products(id) ON DELETE CASCADE | |
| r2_key | TEXT | NOT NULL | "prod/hp-001/a1b2.jpg" |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | |
| content_type | TEXT | NULL | "image/jpeg" |

**Alasan:** pecah dari `Product.images[]`. Path R2, bukan URL.

### 5.9 `service_tickets`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | uuid |
| ticket_number | TEXT | NOT NULL, UNIQUE | "SRV-2026-0001" |
| customer_name | TEXT | NOT NULL | |
| customer_phone | TEXT | NULL | |
| device_model | TEXT | NOT NULL | |
| issue_description | TEXT | NOT NULL | |
| diagnosis | TEXT | NULL | |
| sparepart_cost | INTEGER | NOT NULL DEFAULT 0 | sen |
| service_cost | INTEGER | NOT NULL DEFAULT 0 | sen |
| total_cost | INTEGER | NOT NULL DEFAULT 0 | sen |
| status | TEXT | NOT NULL | 'Menunggu'\|'Dikerjakan'\|'Selesai'\|'Gagal' |
| notes | TEXT | NULL | |
| created_at | INTEGER | NOT NULL DEFAULT (epoch) | |
| updated_at | INTEGER | NOT NULL DEFAULT (epoch) | |

**Index:** `idx_tickets_number` UNIQUE(ticket_number), `idx_tickets_status` (status).
**Alasan:** dari `Ticket` type (`service-ticket-types.ts`).
**OPEN DECISION:** perlu `product_id` FK ke `products`? Saat ini tiket tidak link ke unit. Disarankan tambah `product_id TEXT NULL` untuk V1 (soft link, tidak wajib FK strict).

### 5.10 `trade_ins` (BARU — persist trade-in)

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | uuid |
| ticket_number | TEXT | NOT NULL, UNIQUE | "TI-2026-0001" |
| nama | TEXT | NOT NULL | |
| wa | TEXT | NOT NULL | nomor WA (validasi regex di schemas) |
| merek | TEXT | NOT NULL | |
| model | TEXT | NOT NULL | |
| kondisi | TEXT | NOT NULL | |
| kerusakan | TEXT | NULL | |
| catatan | TEXT | NULL | |
| answers_json | TEXT | NULL | JSON checklist kondisi |
| status | TEXT | NOT NULL DEFAULT 'Menunggu' | 'Menunggu'\|'Dinilai'\|'Ditolak' |
| created_at | INTEGER | NOT NULL DEFAULT (epoch) | |

**Alasan:** dari `tukar-tambah.tsx` form (`tradeInSchema`). Saat ini hanya kirim WA — V1 persist ke DB agar admin bisa follow-up.
**Foto trade-in:** lewat tabel `trade_in_media` (r2_key) — OPEN DECISION apakah V1 perlu foto di DB atau cukup WA manual.

### 5.11 `orders`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| id | TEXT | PK | uuid |
| order_number | TEXT | NOT NULL, UNIQUE | "MUB-10000001" |
| subtotal | INTEGER | NOT NULL | sen |
| shipping_method | TEXT | NULL | |
| shipping_cost | INTEGER | NOT NULL DEFAULT 0 | sen |
| payment | TEXT | NULL | |
| total | INTEGER | NOT NULL | sen |
| status | TEXT | NOT NULL | 'Menunggu Konfirmasi'\|'Diproses'\|'Dikirim'\|'Selesai' |
| customer_name | TEXT | NULL | dari address |
| customer_phone | TEXT | NULL | |
| address_json | TEXT | NULL | JSON OrderAddress |
| created_at | INTEGER | NOT NULL DEFAULT (epoch) | |

**Alasan:** dari `order-store.ts` `Order`. V1 bisa simpan `items` sebagai JSON di `items_json` (tanpa pecah ke `order_items` dulu — simplifikasi).

### 5.12 Ringkasan Tabel V1

1. `brands`
2. `phone_models`
3. `sparepart_categories`
4. `sellers`
5. `products` (gabungan Product+InventoryItem)
6. `product_defects`
7. `product_inspections`
8. `product_images`
9. `service_tickets`
10. `trade_ins`
11. `orders`

(Tabel `order_items` di-skip V1 — `items_json` di `orders`. Tabel `media` generic di-skip V1 — pakai `product_images` + `trade_in_media` bila perlu.)

---

## 6. Unit / Trust / History Model

### 6.1 Prinsip Amanah

Blueprint §5 menekankan: Inspection Report, Kondisi & Kekurangan (jangan sembunyikan cacat), Grade, **Riwayat Unit** dengan ID internal (contoh: `MGH-SAM-S23-00017`).

### 6.2 Apakah perlu pemisahan Product vs Physical Unit di V1?

**KEPUTUSAN: TIDAK untuk V1.** Alasan:
1. Blueprint §9 Fase 3 baru masuk "unit" — saat ini masih Fase data layer awal.
2. `mock-data.ts` & `inventory.tsx` menyatukan listing & barang fisik (1 produk = 1 unit, stock kecil).
3. Pemisahan `products` (listing/katalog) vs `units` (barang fisik dengan IMEI, riwayat servis, garansi per-unit) menambah kompleksitas yang belum dibutuhkan V1.
4. Field `imei_or_sn` SUDAH ada di `InventoryItem` → cukup disimpan di `products` untuk V1 (asumsi 1 row = 1 unit fisik yang dijual).

### 6.3 Dukungan Trust di V1 (sudah cukup)

| Kebutuhan Trust | Di V1 lewat | Status |
|---|---|---|
| Kondisi jujur | `condition`, `condition_note`, `grade` di `products` | ✅ |
| Cacat transparan | `product_defects` (1 row per cacat) | ✅ |
| Inspection report | `product_inspections` (label/status/note) | ✅ |
| Foto kondisi | `product_images` → R2 | ✅ |
| Garansi | `warranty` (text) di `products` | ✅ (belum structured periode) |
| Riwayat unit (masuk/servis/ganti sparepart) | **BELUM** di V1 | ⏸ OPEN DECISION |
| ID internal unit | `imei_or_sn` (V1) / nanti `unit_code` | ⚠️ |

### 6.4 Rekomendasi untuk V2+ (bukan V1)

Jika kelak butuh riwayat lengkap per-unit fisik:
- Buat tabel `units` (`id`, `product_listing_id`, `unit_code` = `MGH-XXX-00017`, `imei`, `status_qc`, `status_stock`, `acquired_at`).
- `unit_history` (`unit_id`, `event_type` = 'masuk'|'inspeksi'|'servis'|'ganti_sparepart'|'garansi'|'terjual', `note`, `created_at`).
- `unit_sparepart_replacements` (`unit_id`, `sparepart_id`, `replaced_at`).
- Ini menjawab blueprint §5 "Riwayat dapat berisi: tanggal masuk, pemeriksaan, servis, sparepart yang diganti, status QC, status stok, garansi".

**Tidak dibuat di V1** — tandai sebagai future extension.

---

## 7. API Contract (V1 minimum)

Semua response JSON. Auth: `Authorization: Bearer <token>` untuk route `/admin/*` dan mutating route. Public route (`GET /api/products`, `GET /api/products/:slug`) tanpa auth.

### 7.1 Products

**GET /api/products**
- Auth: public
- Query: `?type=&brand=&condition=&minPrice=&maxPrice=&search=&page=`
- Resp: `{ items: Product[], total, page }`
- Valid: query di-map & clamp di server.

**GET /api/products/:slug**
- Auth: public
- Resp: `Product` (dengan `defects`, `inspections`, `images` di-join)
- Error: 404 jika slug tidak ada.

**POST /api/products** (admin)
- Auth: required
- Req: `InventoryItemForm` (reuse `inventoryItemSchema`) + `grade`, `defects`, `inspections`
- Valid: Zod
- Resp: 201 `{ id }`
- Error: 400 (validation), 409 (slug exists)

**PUT /api/products/:id** (admin)
- Auth: required
- Req: partial product patch
- Resp: 200 `{ ok: true }`

**DELETE /api/products/:id** (admin)
- Auth: required
- Resp: 200 `{ ok: true }`

### 7.2 Service Tickets

**GET /api/service-tickets** (admin)
- Auth: required
- Resp: `Ticket[]`

**GET /api/service-tickets/:ticketNumber** (admin/publik via tracker)
- Auth: public (tracker page `repair-tracker.$ticketId`)
- Resp: `Ticket` (tanpa data sensitif? — OPEN DECISION)

**POST /api/service-tickets**
- Auth: public (customer submit)
- Req: `ServiceTicketForm` (reuse `serviceTicketSchema`)
- Resp: 201 `{ ticket_number }`

**PATCH /api/service-tickets/:ticketNumber/status** (admin)
- Auth: required
- Req: `{ status, notes? }`
- Valid: enum status
- Resp: 200 `{ ok: true }`

### 7.3 Trade-in

**POST /api/trade-ins**
- Auth: public (customer submit)
- Req: `TradeInForm` (reuse `tradeInSchema`) + `answers`, `files`
- Resp: 201 `{ ticket_number }`

**GET /api/trade-ins** (admin)
- Auth: required
- Resp: `TradeIn[]`

### 7.4 Spareparts

> Sparepart di V1 = `products` dengan `type='sparepart'`. Tidak perlu endpoint terpisah; filter `?type=sparepart`. Jika perlu, `GET /api/spareparts` = alias `GET /api/products?type=sparepart`.

### 7.5 Inspection / History

> V1: inspection melekat pada `products` (CRUD via product). Tidak ada endpoint terpisah.
> History per-unit = V2 (lihat §6.4).

### 7.6 Media Upload

**POST /api/media/upload** (admin)
- Auth: required
- Req: multipart `file`
- Valid: type ∈ {jpg,png,webp}, size ≤ 5MB
- Resp: 200 `{ key, url }`
- Worker upload ke R2, return key.

---

## 8. R2 Design

### 8.1 Jenis File

- Foto kondisi unit HP (`product_images`) — jpg/png/webp
- Foto servis / kerusakan (`service_tickets` media — future)
- Foto trade-in (`trade_ins` media — future)
- Video pengecekan (blueprint sebut "video pemeriksaan") — mp4, future

### 8.2 Key Convention

```
{env}/{entity}/{owner_id}/{uuid}.{ext}
contoh:
  prod/products/hp-001/9f3a-2b1c.jpg
  prod/trade-ins/TI-2026-0001/a1b2.mp4
```

### 8.3 Metadata di D1

- Simpan `r2_key` (bukan URL). URL publik = `R2_PUBLIC_URL + r2_key` (atau signed URL untuk private).
- `product_images` table menyimpan `r2_key`, `sort_order`, `content_type`.

### 8.4 Batasan Upload

- Max 5MB/file, max 10 file/product (V1).
- Type: image/jpeg, image/png, image/webp.
- Validasi di Worker SEBELUM upload ke R2.

### 8.5 Public / Private Access

- V1: **Public R2** (foto produk boleh publik, untuk ditampilkan di web).
- Trade-in / servis foto: bisa Private + signed URL (berisi data pelanggan) — OPEN DECISION.
- Jangan jadikan R2 publik untuk apa pun yang mengandung PII (nama, WA) — foto trade-in sebaiknya private.

### 8.6 Security

- Jangan terima arbitrary path sebagai key — selalu generate uuid di server.
- Sanitize content-type.
- Rate-limit upload endpoint (anti abuse).
- CORS: hanya izinkan origin frontend Mubarok.

---

## 9. Migration Plan

**Prinsip:** aplikasi tetap buildable di setiap milestone. Tidak break UI.

### Milestone 1 — Schema & Seeding (build-safe)
1. Tulis `schema.sql` (D1) sesuai §5.
2. Buat Worker `mubarok-api` dengan `wrangler.toml` (binding D1 + R2).
3. Tulis seed script: konversi `mockBrands`, `mockCategories`, `mockSeller`, `mockProducts` → INSERT ke D1.
4. **Tidak ubah frontend.** Aplikasi tetap pakai localStorage. Build tetap hijau.

### Milestone 2 — Repository Swap (build-safe)
5. Buat `D1ProductRepository` & `D1TicketRepository` implement interface yg sama.
6. Ubah `repositories/index.ts` untuk inject D1 (dengan fallback localStorage jika `env.DB` undefined → dev tanpa backend tetap jalan).
7. Frontend panggil `/api/*` via fetch. Build hijau.

### Milestone 3 — Products Read Path
8. Ganti `fetchProducts()` → `GET /api/products`. Katalog & detail produk dari D1.
9. Cart masih localStorage (client-only, aman).

### Milestone 4 — Write Paths (Admin)
10. `inventory.tsx` & `admin.katalog.tsx` → `POST/PUT /api/products`.
11. `service-new.tsx` → `POST /api/service-tickets`.
12. `tukar-tambah.tsx` → `POST /api/trade-ins` (selain WA).

### Milestone 5 — Media
13. Upload foto ke R2 via `POST /api/media/upload`.
14. `product_images` terisi.

### Milestone 6 — Orders & Checkout
15. `order-store` → `POST /api/orders`. Checkout tetap client, tapi persist order ke D1.

### Milestone 7 — Cutover & Cleanup
16. Hapus `LocalStorageProductRepository`/`LocalStorageTicketRepository` (opsional, bisa dipertahankan sebagai fallback).
17. Hapus mock seed otomatis di client.
18. Final build + test.

---

## 10. Security Considerations

| Area | Risiko | Mitigasi |
|---|---|---|
| API Key / D1 binding | bocor ke client | binding hanya di Worker, tidak pernah di-bundle ke frontend |
| Admin auth | akses tidak sah ke mutasi | JWT/session cookie + verifikasi di Worker; jangan simpan secret di localStorage |
| Upload R2 | abuse / malware | validasi type+size, rate-limit, generate key di server |
| PII (WA, nama) | bocor | trade-in/servis foto → R2 private + signed URL; jangan public |
| CORS | CSRF | izinkan hanya origin resmi |
| Validation | injection | Zod server-side; parameterize semua query D1 (`?` binding) |
| Secret di repo | commit credential | `.dev.vars` / `wrangler secret` — JANGAN commit; sudah di luar scope Sprint 3 |

---

## 11. Risks

1. **Breaking change localStorage → D1**: data lama di localStorage customer tidak migrasi otomatis (cart/order milik mereka). Mitigasi: hybrid period (localStorage sebagai cache client).
2. **D1 latency**: cold start Worker + D1 bisa >100ms. Acceptable untuk toko HP.
3. **Dual source of truth**: saat transisi, produk di localStorage vs D1 bisa divergen. Mitigasi: feature flag `USE_D1`.
4. **Images saat ini di-bundle (`@/assets/*.jpg`)**: `Product.images` di mock berisi import asset, bukan URL. Perlu konversi ke R2 key saat seed.
5. **`specifications` sebagai JSON string**: di D1 jadi TEXT; perlu parse di client. Sudah dilakukan di `products-db.ts` pattern.
6. **Trade-in foto**: saat ini `File[]` di client tidak terkirim (hanya WA). Bila persist ke D1, butuh upload flow.

---

## 12. Open Decisions

| # | Keputusan | Dibutuhkan dari PO | Impact |
|---|---|---|---|
| OD-1 | Apakah `inventory.tsx` = admin kelola `products` (same table) atau entitas berbeda? | Ya/ Tidak | Skema §5.5 |
| OD-2 | Perlu `product_id` FK di `service_tickets`? | Ya/ Tidak | Skema §5.9 |
| OD-3 | Trade-in foto perlu di-DB atau cukup WA manual? | Ya/ Tidak | §5.10 / §8.5 |
| OD-4 | Harga simpan sebagai INTEGER sen atau REAL? | Rekom: INTEGER sen | Semua tabel harga |
| OD-5 | Riwayat unit (units/unit_history) masuk V1 atau V2? | V2 (disarankan) | §6.4 |
| OD-6 | Auth admin: JWT sendiri atau Cloudflare Access / OAuth? | Pilih | §4.5 / §10 |
| OD-7 | `sellers` hardcode 1 row atau tabel penuh? | V1: 1 row cukup | §5.4 |
| OD-8 | R2 public untuk produk, private untuk trade-in/servis? | Ya (disarankan) | §8.5 |
| OD-9 | Apakah `orders.items` dipecah ke `order_items` atau `items_json`? | V1: `items_json` | §5.11 |
| OD-10 | Environment strategy: dev/staging/prod via wrangler env? | Ya | §4.9 |

---

## 13. Recommended Implementation Order

1. **SPRINT 3 lanjutan (Implementasi):** `schema.sql` + seed script (Milestone 1) — build-safe, tidak ubah frontend.
2. `wrangler.toml` + Worker skeleton dengan health check.
3. `D1ProductRepository` + swap di `repositories/index.ts` dengan feature flag `USE_D1`.
4. Read path produk (katalog + detail).
5. Write path admin (inventory, service-new).
6. Trade-in persist (selain WA).
7. R2 upload + product_images.
8. Orders persist.
9. Cleanup & cutover.

**Jangan lakukan Implementasi di Sprint 3 ini** — ini fase audit & design. File ini adalah dokumen perencanaan.

---

## Appendix A — Mapping Field: Mock/TS → D1

| TS Type | Field | D1 Table.Column | Catatan |
|---|---|---|---|
| `Product` | id | products.id | |
| `Product` | slug | products.slug | UNIQUE |
| `Product` | type | products.type | enum |
| `Product` | condition | products.condition | enum |
| `Product` | conditionNote | products.condition_note | AMANAH |
| `Product` | grade | products.grade | nullable |
| `Product` | defects[] | product_defects.defect_text | 1 row/item |
| `Product` | inspection[] | product_inspections | 1 row/item |
| `Product` | images[] | product_images.r2_key | |
| `Product` | price | products.price | INTEGER sen |
| `Product` | specifications | products.specifications | JSON TEXT |
| `InventoryItem` | imei_or_sn | products.imei_or_sn | |
| `InventoryItem` | cost_price | products.cost_price | sen |
| `InventoryItem` | sale_status | products.sale_status | |
| `Ticket` | ticket_number | service_tickets.ticket_number | UNIQUE |
| `Ticket` | status | service_tickets.status | enum |
| `TradeInForm` | wa | trade_ins.wa | regex |
| `Order` | orderNumber | orders.order_number | UNIQUE |

## Appendix B — Validation Reuse

`schemas.ts` sudah punya: `inventoryItemSchema`, `serviceTicketSchema`, `tradeInSchema`.
Worker V1 cukup `import` ketiga schema ini (via bundler) sebagai server-side validation — tidak ada duplikasi logic.

---

**END OF AUDIT DOCUMENT — SPRINT 3 (AUDIT & DESIGN ONLY)**
