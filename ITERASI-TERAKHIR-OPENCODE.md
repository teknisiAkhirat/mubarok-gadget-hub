# Handoff: Mubarok Gadget Hub — Iterasi Terakhir (OpenCode)

> Catatan: ini dokumentasi hasil kerja iterasi terakhir yang dikerjakan lewat OpenCode. Fokus iterasi ini: sinkronisasi schema DB ↔ kode, perbaikan bug link tracker servis, dan pengetatan keamanan (RLS + auth gate). Baca `HANDOFF-JULES.md` untuk ringkasan proyek secara keseluruhan.

---

## 1. Ringkasan Iterasi

**Tanggal:** 2026-08-11
**Branch:** main
**Remote:** https://github.com/teknisiAkhirat/mubarok-gadget-hub.git

Pekerjaan pada iterasi terakhir dibagi 3 area:

- **A. Sinkronisasi schema DB & tipe TypeScript** — menghilangkan 15 error `tsc` dan mismatch antara migrasi Supabase dengan kode.
- **B. Perbaikan bug** — 2 link rusak di halaman `repair-tracker`.
- **D. Keamanan** — `.env` dikeluarkan dari git, RLS `service_tickets` diketatkan, dan gate admin ditambah verifikasi role.

---

## 2. Perubahan File

| File                                                                            | Perubahan                                                                                                                                    |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/integrations/supabase/types.ts`                                            | Tambah tabel `service_tickets` + kolom inventori `products` (`cost_price`, `imei_or_sn`, `merk`, `tipe`, `sale_status`).                     |
| `supabase/migrations/20260722220000_004_create_service_tickets.sql.sql`         | Kolom `diagnosis`, `sparepart_cost`, `service_cost`, `total_cost`; status `Menunggu/Dikerjakan/Selesai/Gagal`; RLS update/delete admin-only. |
| `supabase/migrations/20260811000000_005_sync_service_tickets_and_inventory.sql` | **Baru.** Migrasi idempotent untuk DB live (tambah kolom, ganti CHECK status, ketatkan RLS).                                                 |
| `src/routes/repair-tracker.tsx`                                                 | Hapus tombol "Lacak Servis" (route tak ada), perbaiki link "Nota Servis" → `/repair-tracker/{ticket_number}/invoice`.                        |
| `src/routes/dashboard.tsx`                                                      | `beforeLoad` kini verifikasi `has_role(auth.uid(),'admin')` selain email admin.                                                              |
| `src/routes/inventory.tsx`                                                      | Tambah `beforeLoad` gate admin (session + email + `has_role`).                                                                               |
| `.gitignore`                                                                    | Blokir `.env` agar tidak pernah ter-commit.                                                                                                  |
| `.env`                                                                          | **Dihapus dari tracking git** (`git rm --cached`).                                                                                           |

---

## 3. Verifikasi

Semua lolos setelah iterasi ini:

- `npx tsc --noEmit` → **0 error** (sebelumnya 15).
- `npm run build` → **sukses** (Cloudflare Pages static, output `.output/public`).
- `npm run lint` → error turun 546 → 245; sisa semua `prettier/prettier` di file yang tidak disentuh + 1 `no-explicit-any` di `admin-login.tsx` (pre-existing).

---

## 4. Keamanan

- **RLS `service_tickets`:**
  - `anon` / `authenticated`: tetap bisa SELECT (lacak tiket) dan INSERT (buat tiket baru) — dibutuhkan fitur publik.
  - UPDATE / DELETE: hanya `authenticated` dengan `has_role(auth.uid(),'admin')`.
- **Gate admin** (`/dashboard` & `/inventory`): session aktif + email cocok `VITE_ADMIN_EMAIL` + role `admin` di tabel `user_roles`.
- `.env` tidak lagi ter-track di git; key baru (jika ada) jangan pernah dicommit.

---

## 5. Yang Perlu Dilakukan Manual

1. **Jalankan migrasi A3** di Supabase SQL editor:
   `supabase/migrations/20260811000000_005_sync_service_tickets_and_inventory.sql`
   (idempotent — aman dijalankan berulang).
2. **Pastikan akun admin terdaftar di `user_roles`** dengan role `admin`. Trigger `bootstrap_first_admin` hanya menetapkan user pertama. Jika admin kamu belum ada, dashboard & inventory akan me-redirect ke `/`.

---

## 6. Catatan Lanjutan (belum dikerjakan)

- Checkout masih belum mempersistenkan order (tidak ada tabel `orders`).
- Statistik "Pesanan / Total Penjualan" di dashboard masih hardcoded 0.
- `OPENAI_API_KEY` & `DEEPSEEK_API_KEY` di `.env` masih placeholder (`$API_BARU`).
- Tidak ada unit test di proyek.
- Working tree masih punya perubahan yang belum di-commit.
