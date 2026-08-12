# Changelog

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
