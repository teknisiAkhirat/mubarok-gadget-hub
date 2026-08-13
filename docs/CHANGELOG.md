# Changelog

## V1.3 (2026-08-13)

### UI Polish Katalog & Profil Toko
- `produk.tsx`: filter harga jadi rentang Min/Max (default 0–10jt) dengan input angka + slider
- `produk.tsx`: filter Brand hanya muncul untuk mode HP/Tablet; Kategori & Kompatibel hanya untuk mode Sparepart
- `produk.tsx`: breadcrumb halaman Produk kini link
- `produk.tsx`: hilangkan blok lokasi penjual hardcoded "Blora" dari sidebar
- `ProductCard.tsx`: hapus lokasi penjual + `handleWa` duplikat, tambah transition/hover, rating star berwarna

### Data Toko Aktual (single source of truth)
- `Footer.tsx`: refactor layout `bg-card`, data toko aktual (Jl. Jatirogo Gg. Wali Songo No. 40, Jepon, Blora; Senin–Sabtu 09.00–15.00), CTA "Chat WhatsApp" dikembalikan via `waLink`
- `tentang.tsx`: pemutakhiran naratif, alamat aktual, judul lengkap "Mubarok Smartphone Sales and Services", hapus ulasan fiktif (rating/ratingCount)
- `StoreInfoCard.tsx` (BARU): kartu info toko ter-mount di halaman beranda (`index.tsx`), menggantikan blok info toko lama yang masih memakai `mockSeller.city` ("Blora, Jawa Tengah") dan rating fiktif
- `index.tsx`: blok info toko diganti `StoreInfoCard` (import lama `mockSeller`/`waLink`/ikon tidak terpakai dibersihkan)

### Konfirmasi Audit
- `src/lib/products-db.ts` sudah 100% lokal (mock data in-memory), tanpa jejak Supabase
- Tidak ada referensi `@supabase` tersisa di seluruh `src/**/*.ts*`

---

## V1.2 (2026-08-12)

### Admin Protection
- Added PIN-based auth gate for `/admin/servis`
- PIN stored as `VITE_ADMIN_PIN` environment variable (not hardcoded)
- Login status stored in `sessionStorage` (auto-logout when tab closed)
- Added logout button on admin page
- Fail-safe: if no PIN configured, access is denied

### Data Layer Refactor
- Refactored `ticket-store.ts` to repository pattern
- Created `TicketRepository` interface (`src/lib/repositories/ticket-repository.ts`)
- Created `LocalStorageTicketRepository` implementation (`src/lib/repositories/local-storage-ticket-repository.ts`)
- Created repository index (`src/lib/repositories/index.ts`) as single switch point
- Updated all imports to use `ticketRepository` from `@/lib/repositories`
- Old `ticket-store.ts` kept as backward-compatible wrapper (deprecated)

### Documentation
- Created `docs/schema-tickets.md` with database schema plan
- Created this CHANGELOG

---

## V1.1 (2026-08-12)

### Fixes
- Validated WhatsApp number format (62895604901090)
- Cleaned lint warnings (eslint ignore ui/ folder, disable comments for exports)
- Implemented localStorage persistence for service tickets

### Features
- Admin servis page (`/admin/servis`) for ticket status updates
- Trade-in estimator (`/tukar-tambah`) with brand/model/condition selection → WhatsApp CTA
- Sparepart filter by compatible phone brand in catalog
- FAQ garansi servis page (`/faq-garansi`) with accordion

---

## V1.0 (2026-08-12)

### Initial Release
- Homepage with hero, categories, brands, featured/latest products
- Product catalog with search, filter, sort
- Product detail with WhatsApp CTA
- Service ticket creation and tracking
- Spareparts catalog
- Trade-in banner
- About page
- Mobile navigation (hamburger menu)
- Trust sections
- Structured mock data (20+ products)
- Production build passes

---

## Known Limitations

### localStorage (Current)
- Data tidak sinkron antar device
- Data hilang jika user clear browser data
- Tidak ada backup/recovery

### Solusi (Ready for Implementation)
- Repository pattern sudah di-refactor, tinggal ganti implementasi
- Ganti `LocalStorageTicketRepository` → `D1TicketRepository` atau `SupabaseTicketRepository`
- Update `src/lib/repositories/index.ts` untuk use implementation baru

---

## TODO untuk Database Connection

1. Pilih database backend (Cloudflare D1 / Supabase)
2. Buat migration file sesuai `docs/schema-tickets.md`
3. Buat `DatabaseTicketRepository` yang implement `TicketRepository` interface
4. Update `src/lib/repositories/index.ts` untuk use implementation baru
5. Setup environment variables untuk database connection
6. Test end-to-end dengan database real
