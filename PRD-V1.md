# PRD V1 — Mubarok Gadget Hub
## UI/UX Foundation — Mobile First

**Status:** Draft untuk Sprint 1  
**Project:** Mubarok Gadget Hub  
**Repository:** `teknisiAkhirat/mubarok-gadget-hub`  
**Fokus Sprint:** Tampilan dan pengalaman pengguna terlebih dahulu  
**Backend:** Belum menjadi fokus Sprint 1  
**Data:** Mock data diperbolehkan

---

# 1. Product Goal

Membangun website Mubarok Gadget Hub yang terasa profesional, cepat dipahami, nyaman digunakan melalui smartphone, dan sejak tampilan pertama sudah menunjukkan identitas:

> **Toko HP bekas, sparepart, servis, dan tukar tambah yang amanah dan transparan.**

Website harus membuat calon pelanggan merasa:

1. mudah mencari HP,
2. mudah memahami kondisi HP,
3. mudah melihat kekurangan unit,
4. mudah menghubungi toko,
5. mengetahui bahwa Mubarok juga menerima servis, sparepart, dan tukar tambah.

# 2. Target User

## A. Pembeli HP bekas

Kebutuhan:
- mencari model tertentu,
- membandingkan harga,
- mengetahui kondisi,
- mengetahui kekurangan,
- mengetahui garansi,
- menghubungi penjual.

## B. Pemilik HP yang ingin tukar tambah

Kebutuhan:
- mengetahui apakah HP miliknya dapat diterima,
- menjelaskan kondisi/kerusakan,
- mengirim foto,
- mendapatkan penilaian awal dari toko.

## C. Pemilik HP rusak

Kebutuhan:
- konsultasi kerusakan,
- meminta pemeriksaan,
- mengetahui opsi reparasi,
- mempertimbangkan penggantian sparepart.

## D. Teknisi / pembeli sparepart

Kebutuhan:
- mencari sparepart,
- mengetahui kompatibilitas,
- mengetahui kondisi/originalitas sesuai informasi toko,
- mengetahui stok dan harga,
- menghubungi toko.

# 3. Information Architecture

Navigasi utama V1:

- Beranda
- Produk / HP Bekas
- Tukar Tambah
- Servis
- Sparepart

Navigasi sekunder:

- Tentang Mubarok
- Kontak / Lokasi
- Kebijakan / Garansi bila diperlukan

# 4. Homepage

## 4.1 Header

Mobile-first.

Elemen:
- logo/nama Mubarok Gadget Hub,
- search,
- cart bila memang dipertahankan dari aplikasi saat ini,
- menu yang sederhana.

Jangan memenuhi header dengan terlalu banyak ikon.

## 4.2 Hero

Pesan utama harus langsung menjelaskan positioning.

Konsep copy:

> **HP Bekas Apa Adanya. Kondisi Dijelaskan.**

Subteks:

> HP bekas, sparepart, servis, dan tukar tambah dengan informasi kondisi yang transparan.

CTA:

- **Lihat HP**
- **Tukar Tambah**

## 4.3 Quick Services

Empat layanan utama:

1. HP Bekas
2. Tukar Tambah
3. Servis HP
4. Sparepart

Ditampilkan sebagai kartu/icon yang mudah disentuh di mobile.

## 4.4 Produk Terbaru

Menampilkan beberapa produk mock.

Product card minimal:
- foto,
- merek/model,
- harga,
- grade/kondisi,
- status stok,
- indikator kekurangan penting bila ada.

## 4.5 Trust Section

Judul konsep:

> **Kenapa Beli di Mubarok?**

Poin:
- Kondisi dijelaskan apa adanya
- Unit diperiksa sebelum dijual
- Kekurangan disebutkan
- Garansi toko sesuai ketentuan

Jangan membuat klaim yang belum benar-benar dapat dibuktikan oleh operasional toko.

## 4.6 Cara Kerja

Contoh:

**Pilih HP → Cek Kondisi → Tanya → Transaksi**

Untuk servis:

**Kirim Keluhan → Pemeriksaan → Penjelasan → Persetujuan → Perbaikan**

## 4.7 Tukar Tambah CTA

Section khusus:

> **Punya HP lama atau HP rusak?**

CTA:

> **Coba Tukar Tambah**

## 4.8 Servis CTA

Section:

> **HP Bermasalah?**

Subteks:

> Kirim keluhan dan biarkan kami memeriksanya terlebih dahulu.

CTA:

> **Konsultasi Servis**

## 4.9 Testimoni

Gunakan mock data untuk V1.

Jangan membuat testimoni palsu yang terlihat seperti pelanggan nyata.

Jika belum ada data nyata, gunakan placeholder yang jelas atau sembunyikan section sampai tersedia.

## 4.10 Lokasi & Kontak

- lokasi toko,
- WhatsApp,
- jam operasional bila datanya sudah tersedia,
- CTA kontak.

## 4.11 Footer

- navigasi,
- layanan,
- kontak,
- sosial media bila tersedia,
- copyright.

# 5. Catalog Page

## Tujuan

Membantu pengguna menemukan HP bekas dengan cepat.

## Fitur UI V1

- search,
- filter merek,
- filter harga,
- filter kondisi/grade,
- filter status stok,
- sorting,
- product grid.

## Mobile

Default:
- 2 kolom jika ukuran kartu tetap nyaman,
- filter menggunakan bottom sheet/drawer,
- search mudah dijangkau,
- jangan membuat kartu terlalu padat.

## Product Card

Wajib menampilkan:

- foto utama,
- nama,
- varian storage/RAM bila relevan,
- harga,
- grade,
- status stok.

Jika ada cacat penting:

> **Layar retak**

atau indikator singkat lain harus terlihat tanpa pengguna membuka detail.

# 6. Product Detail Page

Ini adalah halaman trust terpenting.

## Urutan UI

1. Gallery/foto
2. Nama produk
3. Harga
4. Status stok
5. Grade
6. Ringkasan kondisi
7. Kekurangan unit
8. Hasil pemeriksaan
9. Kelengkapan
10. Garansi
11. Riwayat unit bila tersedia
12. Video pengecekan bila tersedia
13. CTA WhatsApp

## Inspection Summary

Contoh:

| Pemeriksaan | Status |
|---|---|
| Layar | Normal |
| Touchscreen | Normal |
| Kamera | Normal |
| Speaker | Normal |
| Charging | Normal |
| Fingerprint | Normal |
| NFC | Normal |

Pada V1 data bersifat mock.

## Defect Disclosure

Jika ada kekurangan, tampilkan secara jelas.

Contoh:

> **Kekurangan Unit**
>
> Frame kanan terdapat gores ringan.  
> Back cover terdapat bekas pemakaian.

Kekurangan tidak boleh disembunyikan di bagian yang sulit ditemukan.

## Warranty

Contoh:

> Garansi toko: 30 hari

Gunakan data yang benar ketika backend/operasional sudah tersedia.

# 7. Trade-In Page

## Tujuan

Menerima calon HP dari pengguna.

## Form V1

Field:
- nama,
- WhatsApp,
- merek,
- model,
- kondisi,
- kerusakan,
- foto,
- catatan.

Pertanyaan kondisi:
- Apakah HP menyala?
- Apakah layar normal?
- Apakah touchscreen normal?
- Apakah ada kerusakan fisik?
- Apakah pernah diperbaiki?

## CTA

> **Kirim Pengajuan**

Pada V1 belum perlu kalkulator harga otomatis.

Permintaan dapat diarahkan ke WhatsApp/mock submission.

# 8. Service Page

## Tujuan

Memudahkan pemilik HP rusak mengajukan pemeriksaan.

## Form V1

- nama,
- WhatsApp,
- merek,
- model,
- keluhan,
- jenis kerusakan,
- foto/video,
- catatan.

Jenis kerusakan contoh:
- layar,
- battery,
- charging,
- kamera,
- speaker/mic,
- software,
- motherboard/IC,
- lainnya.

## CTA

> **Ajukan Pemeriksaan**

Jangan menjanjikan harga perbaikan sebelum diagnosis.

Copy yang dianjurkan:

> **Harga dan tindakan perbaikan ditentukan setelah pemeriksaan kondisi perangkat.**

# 9. Sparepart Page

## Tujuan

Menampilkan sparepart yang tersedia.

Product card:
- nama sparepart,
- kompatibilitas,
- kondisi,
- status original/quality sesuai data sebenarnya,
- tested bila memang sudah diuji,
- harga,
- stok.

CTA:

> **Tanya Sparepart**

Jangan menggunakan label "original" jika statusnya belum diverifikasi.

# 10. About / Trust Page

Isi:

- siapa Mubarok Gadget Hub,
- layanan,
- prinsip transparansi,
- bagaimana HP diperiksa,
- bagaimana kekurangan dijelaskan,
- garansi,
- kontak.

Fokus pada kepercayaan, bukan klaim berlebihan.

# 11. Visual Direction

## Karakter

- modern,
- clean,
- teknologi,
- profesional,
- hangat,
- terpercaya.

## Prioritas

1. readability,
2. hierarchy,
3. whitespace,
4. product photography,
5. clear CTA,
6. consistent components.

## Hindari

- animasi berlebihan,
- terlalu banyak gradient,
- badge berlebihan,
- layout marketplace generik,
- teks kecil,
- informasi kondisi yang disembunyikan,
- elemen dekoratif yang mengganggu pembelian.

# 12. Responsive Strategy

## Primary viewport

**Mobile 360–430px**

Desain harus diuji minimal pada:
- 360px,
- 390px,
- 412px.

## Secondary

- tablet,
- desktop.

Desktop tidak boleh memaksa layout mobile menjadi terlalu lebar.

# 13. Components

Komponen V1 yang perlu distandarkan:

- Header
- Mobile navigation
- Search bar
- Button
- Product card
- Product grid
- Price display
- Condition badge
- Grade badge
- Stock badge
- Service card
- Trust card
- Inspection row
- Defect disclosure box
- Warranty card
- CTA section
- Footer
- Modal/drawer
- Form field
- Image gallery

Komponen harus reusable.

# 14. Mock Data

Gunakan data realistis tetapi jelas sebagai data pengembangan.

Contoh unit:

### Samsung Galaxy S23 8/256

Harga:
Rp 5.XXX.XXX

Grade:
B+

Kondisi:
- layar normal
- touch normal
- kamera normal
- body memiliki gores ringan

Kelengkapan:
unit + charger

Garansi:
30 hari

Data mock harus mudah diganti ketika database mulai digunakan.

# 15. Accessibility & Usability

Minimum:

- kontras teks cukup,
- tombol mudah disentuh,
- form memiliki label,
- gambar memiliki alt text,
- keyboard navigation pada desktop,
- tidak bergantung pada warna saja untuk menunjukkan status,
- loading/error state jelas.

# 16. Performance

V1 harus menghindari:

- gambar terlalu besar,
- library tidak diperlukan,
- animasi berat,
- layout shift yang berlebihan.

Prioritas:
**mobile performance > dekorasi.**

# 17. SEO Foundation

V1 minimal:

- title setiap halaman,
- meta description,
- heading hierarchy,
- semantic HTML,
- URL yang masuk akal,
- alt text,
- product content yang dapat dibaca crawler.

SEO lanjutan dikerjakan setelah struktur UI stabil.

# 18. Functional Scope V1

## Yang BOLEH menggunakan mock

- produk,
- stok,
- inspection,
- grade,
- warranty,
- testimoni,
- trade-in submission,
- service submission.

## Yang BELUM wajib

- login pelanggan,
- payment gateway,
- checkout kompleks,
- order management,
- database production,
- admin dashboard,
- CRM,
- analytics lanjutan,
- kalkulator trade-in otomatis.

# 19. User Flow Utama

## Flow membeli HP

Beranda
→ Produk
→ Search/filter
→ Product detail
→ Cek kondisi
→ Cek garansi
→ WhatsApp
→ transaksi manual

## Flow tukar tambah

Beranda
→ Tukar Tambah
→ Isi perangkat
→ Upload foto
→ Kirim
→ WhatsApp/manual assessment

## Flow servis

Beranda
→ Servis
→ Isi keluhan
→ Upload foto/video
→ Ajukan pemeriksaan
→ Pemeriksaan manual

## Flow sparepart

Beranda
→ Sparepart
→ Cari model
→ Detail sparepart
→ WhatsApp

# 20. Sprint 1 Checklist

## Foundation

- [ ] Audit struktur UI existing
- [ ] Pertahankan stack yang ada
- [ ] Tentukan design tokens
- [ ] Rapikan global layout
- [ ] Mobile-first breakpoints

## Homepage

- [ ] Header
- [ ] Hero
- [ ] CTA
- [ ] Quick services
- [ ] Product section
- [ ] Trust section
- [ ] How it works
- [ ] Trade-in CTA
- [ ] Service CTA
- [ ] Contact
- [ ] Footer

## Catalog

- [ ] Search
- [ ] Filter UI
- [ ] Sort UI
- [ ] Product grid
- [ ] Product card
- [ ] Empty state

## Product detail

- [ ] Gallery
- [ ] Price
- [ ] Stock
- [ ] Grade
- [ ] Condition
- [ ] Defect disclosure
- [ ] Inspection
- [ ] Warranty
- [ ] CTA

## Service

- [ ] Landing UI
- [ ] Form
- [ ] Error state
- [ ] Success state

## Trade-in

- [ ] Landing UI
- [ ] Form
- [ ] Upload UI
- [ ] Success state

## Sparepart

- [ ] Catalog
- [ ] Product card
- [ ] Detail
- [ ] CTA

# 21. Definition of Done — Sprint 1

Sprint 1 selesai jika:

- seluruh halaman utama V1 tersedia,
- UI konsisten,
- mobile 360–430px nyaman digunakan,
- desktop tetap layak,
- mock data tampil realistis,
- semua CTA utama berfungsi pada level UI,
- tidak ada halaman utama yang rusak,
- `npm run build` berhasil,
- lint/test yang tersedia berhasil atau error terdokumentasi,
- tidak ada credential/secret di source code,
- tidak ada perubahan stack tanpa alasan,
- perubahan di-commit.

# 22. Instruksi untuk OpenCode

OpenCode bertindak sebagai implementation agent.

Sebelum coding:

1. Baca `BLUEPRINT.md`.
2. Baca dokumen PRD ini.
3. Audit repository saat ini.
4. Jangan menghapus pekerjaan yang sudah baik.
5. Identifikasi bagian yang sudah tersedia.
6. Buat checklist implementasi.
7. Kerjakan Sprint 1 secara bertahap.

Selama coding:

- mobile-first,
- reusable components,
- gunakan mock data,
- jangan membuat backend production,
- jangan memasukkan secret,
- jangan memperluas scope,
- jangan mengganti stack tanpa alasan,
- pertahankan fitur yang sudah bekerja.

Setelah coding:

1. jalankan build,
2. jalankan lint/test jika tersedia,
3. perbaiki error,
4. review responsive layout,
5. review UX,
6. cek tidak ada secret,
7. commit perubahan.

Jika ada requirement yang ambigu dan tidak dapat diselesaikan dengan aman dari PRD, catat sebagai TODO daripada membuat asumsi besar.

# 23. Out of Scope Sprint 1

Jangan membangun:

- payment gateway,
- checkout production,
- authentication kompleks,
- database production,
- CRM,
- BI dashboard,
- inventory backend,
- automated trade-in valuation,
- AI diagnosis,
- marketplace integration,
- production deployment automation.

Fitur tersebut masuk roadmap berikutnya.

# 24. Next Milestone

Setelah Sprint 1 UI selesai:

**Milestone 2 — Trust Layer**

Fokus:
- inspection report,
- grade system,
- unit ID,
- riwayat unit,
- warranty,
- defect disclosure yang lebih terstruktur.

Baru setelah itu:

**Milestone 3 — Data & Operations**

---

## END OF PRD V1
