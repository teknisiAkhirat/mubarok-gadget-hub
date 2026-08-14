# AUDIT REPORT — Mubarok Gadget Hub

Tanggal audit: 13 Agustus 2026  
Branch: `clean-rebuild`  
Commit HEAD: `85e044a` docs(Sprint3): backend architecture audit & Cloudflare D1 schema design  
Acuan aturan: `OPENCODE_AGENT_POLICY.md` (`AGENT.md` tidak ada di repo; policy tersebut adalah aturan aktif)

## Ringkasan

Audit terhadap repository pada kondisi working tree clean (sebelum fix). Verifikasi lengkap `npm run build`, `npx tsc --noEmit`, `npm run lint`, dan `npm test` dilakukan. Dua masalah “SAFE” ditemukan dan diperbaiki.

## Hasil Verifikasi

| Gate               | Sebelum Fix | Sesudah Fix |
| ------------------ | ----------- | ----------- |
| `npm run build`    | ✅ LULUS    | ✅ LULUS    |
| `npx tsc --noEmit` | ✅ LULUS    | ✅ LULUS    |
| `npm run lint`     | ✅ LULUS    | ✅ LULUS    |
| `npm test`         | ❌ GAGAL    | ✅ LULUS    |

## Analisis Perubahan HEAD

Komit `85e044a` murni dokumentasi:
- Menambah `blueprint.md` (669 baris) — referensi arsitektur utama proyek.
- Menambah `docs/SPRINT-3-BACKEND-AUDIT.md` (728 baris) — audit backend Cloudflare D1/R2/Workers, skema 11 tabel, kontrak API V1, rencana migrasi, 10 open decisions.
- **Tidak ada perubahan kode sumber** pada komit ini.

## Analisis Working Tree (Sebelum Fix)

Tidak ada perubahan file yang belum di-commit sebelum audit ini dimulai.

## Fix yang Diterapkan (SAFE)

### 1. Ketidakcocokan lingkungan test (`vitest.config.ts`)
**Masalah:** `jsdom@30.0.1` menarik `undici@8.10.0` yang membutuhkan Node.js `>=22.19.0`, sementara environment menggunakan Node `v20.20.2`. Akibatnya `npm test` gagal dengan error `webidl.util.markAsUncloneable is not a function`.

**Fix:** Ubah `environment: "jsdom"` menjadi `environment: "node"` di `vitest.config.ts:6`.

**Alasan SAFE:** Ketiga file test (`schemas.test.ts`, `service-flow.test.ts`, `ticket-repository.test.ts`) tidak memakai API browser-native selain `localStorage`, dan semuanya sudah di-mock secara manual via `globalThis.localStorage`. Tidak ada kerugian fungsional.

### 2. Repository localStorage tidak testable di environment Node (`local-storage-ticket-repository.ts`)
**Masalah:** `loadTickets()` dan `saveTickets()` memeriksa `typeof window === "undefined"`. Di environment Node (setelah fix #1), `window` memang undefined, sehingga repository selalu return `[]` dan menolak simpan. Tes `ticket-repository.test.ts` 5 skenario gagal.

**Fix:** Ganti guard dari `typeof window === "undefined"` menjadi `typeof globalThis.localStorage === "undefined"` pada `src/lib/repositories/local-storage-ticket-repository.ts:7` dan `:18`.

**Alasan SAFE:** Perubahan memperluas portabilitas kode (bukan sekedar untuk test). Kode kini berjalan di runtime manapun yang menyediakan `localStorage` (Cloudflare Workers, Deno, Bun, Node), tanpa bergantung pada keberadaan `window`. Tidak ada perilaku runtime yang diubah untuk kasus penggunaan normal.

## Kepatuhan Policy

- ✅ Bekerja di branch `clean-rebuild`.
- ✅ Build gate (`npm run build`) lulus.
- ✅ `npx tsc --noEmit` lulus.
- ✅ `npm run lint` lulus.
- ✅ `npm test` lulus (3 file, 17 tes).
- ✅ Tidak ada secret/credential baru.
- ✅ Tidak ada perubahan arsitektur fundamental.
- ✅ Tidak ada akses luar repo.
- ✅ Tidak ada akses produksi atau data sensitif.
- ✅ WhatsApp tetap satu source of truth (`src/lib/format.ts`).
- ✅ Tidak ada referensi Supabase di `src/**/*`.

## Item Berkelanjutan

1. **StoreInfoCard.tsx** — Terpasang di `src/routes/index.tsx:372`. Tidak ada dead code.
2. **Footer.tsx** — CTA WhatsApp aktif menggunakan `waLink` + `formatWA(mockSeller.whatsapp)`.
3. **products-db.ts** — Tidak ada referensi Supabase di source code.
4. **.env** — Masih memuat variabel legacy, namun sudah di-`.gitignore` dan tidak masuk repository. Aman sesuai kebijakan clean-rebuild.
5. **Node.js version untuk CI** — Saat ini Node `20.20.2`. Jika `.github/workflows/ci.yml` tetap menjalankan `npm test`, pastikan Node `>=22.19` **atau** pertahankan config vitest `node` environment agar CI tidak gagal.

## Status Akhir

Repository dalam kondisi bersih. Build, type check, lint, dan test semuanya lulus. Dua fix SAFE telah diterapkan. Tidak ada safety rail yang terpicu. Siap untuk milestone berikutnya atau commit perubahan.
