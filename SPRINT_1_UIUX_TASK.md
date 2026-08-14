# SPRINT TASK — MUBAROK GADGET HUB

## Fokus: UI/UX FOUNDATION (Lanjutan Fase 1, sesuai PRD-V1.md Section 20)

> Baca AUTONOMOUS_CODING_WORKFLOW.md, BLUEPRINT_Mubarok_gadgethab_chat_GPT_12_Agustus_26.md, PRD-V1.md dulu sebelum mulai.
> Mode: FULL AUTONOMOUS WITH SAFETY RAILS

**PENTING:** Repo ini sudah melalui audit/cleanup (42 file tidak terpakai sudah dihapus, lint & build bersih). JANGAN bangun ulang dari nol. Audit dulu komponen/halaman yang SUDAH ADA sebelum membuat yang baru.

---

## MILESTONE 0: AUDIT STATUS TERKINI (WAJIB, JANGAN SKIP)

- Cek struktur src/pages atau src/routes yang sudah ada
- Cocokkan dengan checklist PRD-V1.md Section 20 (Foundation, Homepage, Catalog, Product Detail, Service, Trade-in, Sparepart)
- Buat SPRINT_1_STATUS.md berisi: sudah ada / belum ada / partial, per item checklist
- Baru lanjut ke milestone berikutnya berdasarkan hasil audit ini — SKIP milestone yang itemnya sudah selesai

## MILESTONE 1: FOUNDATION & DESIGN TOKENS

- Pastikan design tokens (warna, spacing, typography) konsisten dengan arah visual PRD-V1.md Section 11 (modern, clean, trust-first, hindari marketplace generik)
- Pertahankan komponen shadcn yang sudah dipertahankan dari cleanup (button, input, card, badge, textarea, tabs, sonner, label) — pakai ini sebagai basis, jangan tambah library UI baru kecuali benar-benar perlu
- Rapikan global layout & mobile-first breakpoint (360/390/412px)

## MILESTONE 2: HOMEPAGE

- Header (logo, search, menu sederhana — jangan penuh ikon)
- Hero dengan copy: "HP Bekas Apa Adanya. Kondisi Dijelaskan."
- Quick services (4 kartu: HP Bekas, Tukar Tambah, Servis, Sparepart)
- Produk terbaru (mock data, product card: foto/merek/harga/grade/stok)
- Trust section ("Kenapa Beli di Mubarok?")
- Cara kerja (Pilih HP → Cek Kondisi → Tanya → Transaksi)
- CTA Tukar Tambah & CTA Servis
- Testimoni (mock jelas, JANGAN terkesan data asli)
- Lokasi/kontak + Footer

## MILESTONE 3: KATALOG HP

- Search, filter merek/harga/kondisi/stok, sorting
- Product grid mobile 2 kolom, filter via bottom sheet/drawer
- Product card wajib tampilkan indikator cacat penting (mis. "Layar retak") tanpa buka detail
- Empty state jelas

## MILESTONE 4: DETAIL PRODUK (halaman trust terpenting)

- Urutan: Gallery → Nama → Harga → Stok → Grade → Ringkasan kondisi → Kekurangan unit → Inspection summary (tabel) → Kelengkapan → Garansi → CTA WhatsApp
- Defect disclosure harus terlihat jelas, TIDAK boleh disembunyikan
- Mock data realistis (contoh Samsung Galaxy S23 di PRD Section 14)

## MILESTONE 5: SERVIS & TUKAR TAMBAH

- Halaman Servis: form (nama, WA, merek, model, keluhan, jenis kerusakan, foto/video, catatan), CTA "Ajukan Pemeriksaan", copy wajib: "Harga dan tindakan perbaikan ditentukan setelah pemeriksaan kondisi perangkat."
- Halaman Tukar Tambah: form (nama, WA, merek, model, kondisi, kerusakan, foto, catatan), pertanyaan kondisi checklist, CTA "Kirim Pengajuan"
- Belum perlu kalkulator harga otomatis — submission ke WhatsApp/mock

## MILESTONE 6: SPAREPART

- Katalog sparepart: nama, kompatibilitas, kondisi, status original/quality (sesuai data sebenarnya, JANGAN label "original" tanpa verifikasi), tested, harga, stok
- CTA "Tanya Sparepart"

## MILESTONE 7: FORM VALIDATION & STATES

- Semua form (Servis, Tukar Tambah) punya error state & success state yang jelas
- Upload foto/video UI (boleh mock, belum perlu backend storage)
- Loading state saat submit

## MILESTONE 8: RESPONSIVE & ACCESSIBILITY CHECK

- Uji ulang semua halaman baru di 360px, 390px, 412px
- Kontras teks cukup, tombol ≥44px, form punya label, gambar ada alt text
- Cek desktop tidak memaksa layout mobile jadi lebar aneh

## MILESTONE 9: SEO FOUNDATION & PERFORMANCE

- Title & meta description tiap halaman
- Heading hierarchy semantic
- Cek tidak ada gambar mock terlalu besar / library berlebihan

## MILESTONE 10: FINAL REVIEW & BUILD

- npm run build sukses, npm run lint 0 warning
- Review semua CTA berfungsi di level UI
- Pastikan tidak ada credential/secret masuk source code
- Update SPRINT_1_STATUS.md dengan status final
- Commit final: "feat: sprint UI/UX foundation mubarok gadget hub"

---

## SAFETY RAILS (sesuai AUTONOMOUS_CODING_WORKFLOW.md Section 8)

- Butuh credential/API key/token baru → STOP, laporkan, JANGAN dikerjakan (akan diisi manual)
- Ingin ganti stack fundamental → STOP, laporkan
- Keputusan bisnis (harga, kebijakan garansi pasti, dll.) yang tidak ada di PRD → STOP, catat sebagai TODO, jangan berasumsi
- Testimoni HARUS mock yang jelas, JANGAN dibuat terlihat seperti data pelanggan asli

## MULAI SEKARANG

Kerjakan Milestone 0 dulu (audit), lalu lanjutkan Milestone 1-10 berurutan berdasarkan hasil audit — skip yang sudah selesai, kerjakan yang belum. Jangan berhenti kecuali Safety Rail terpenuhi.
