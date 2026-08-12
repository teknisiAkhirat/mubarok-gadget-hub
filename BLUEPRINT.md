# Mubarok Gadget Hub — Blueprint Proyek Utama

> Dokumen ini adalah peta besar proyek. Implementasi dilakukan bertahap, satu milestone pada satu waktu.
> Jangan menganggap semua fitur di dokumen ini harus dibangun sekaligus.

## 1. Visi

Mubarok Gadget Hub adalah toko online yang berfokus pada:

- HP bekas yang kondisi dan kekurangannya dijelaskan secara jujur.
- Sparepart HP, dengan prioritas sparepart original/berkualitas sesuai stok.
- Servis dan reparasi HP.
- Tukar tambah HP, termasuk HP yang bermasalah/rusak.
- Transparansi pemeriksaan, kondisi, riwayat, dan garansi.

Prinsip utama:

> **Amanah, transparan, mudah digunakan, dan mengutamakan kejujuran kondisi barang.**

Website bukan sekadar katalog HP bekas. Website harus membangun kepercayaan sebelum transaksi.

---

## 2. Tujuan Produk

### Tujuan utama

1. Menampilkan HP bekas secara profesional dan mudah dipahami.
2. Menjelaskan kondisi dan kekurangan setiap unit secara transparan.
3. Menjadi pintu masuk untuk pembelian HP, servis, sparepart, dan tukar tambah.
4. Mengutamakan pengalaman mobile karena mayoritas calon pelanggan menggunakan HP.
5. Menjadi fondasi sistem operasional Mubarok Gadget Hub di masa depan.

### Tujuan jangka panjang

Website dapat berkembang menjadi ekosistem:

**Jual HP → Beli HP → Tukar Tambah → Servis → Sparepart → QC → Riwayat Unit → Garansi → CRM → Analitik**

---

## 3. Prinsip Produk

### Amanah

Jangan menyembunyikan cacat/kekurangan unit.

### Transparansi

Kondisi HP harus disajikan dengan bahasa sederhana dan jelas.

### Mobile-first

Desain utama dimulai dari layar smartphone, kemudian diperluas ke tablet/desktop.

### Sederhana

Pelanggan harus cepat menemukan HP, mengetahui kondisinya, lalu menghubungi toko.

### Trust-first

Elemen yang meningkatkan kepercayaan lebih penting daripada dekorasi visual.

### Bertahap

Jangan membangun backend kompleks sebelum struktur UI/UX dan alur pengguna matang.

---

# 4. Pilar Bisnis

## A. HP Bekas

- Katalog HP
- Pencarian
- Filter
- Kategori/merek
- Harga
- Kondisi
- Grade
- Stok
- Kelengkapan
- Garansi
- Detail pemeriksaan
- Foto/video unit
- Riwayat unit

## B. Tukar Tambah

- Pilih perangkat
- Masukkan kondisi
- Upload foto
- Jelaskan kerusakan
- Ajukan tukar tambah
- Penilaian manual pada tahap awal
- Estimasi harga pada tahap berikutnya

## C. Servis

- Pilih jenis kerusakan
- Pilih perangkat
- Jelaskan keluhan
- Upload foto/video
- Ajukan pemeriksaan
- Status servis pada tahap lanjutan

## D. Sparepart

- Katalog sparepart
- Merek/model kompatibel
- Kondisi
- Original/non-original bila relevan
- Status tested
- Garansi
- Harga
- Stok

---

# 5. Sistem Kepercayaan / Trust System

Ini adalah salah satu pembeda utama Mubarok Gadget Hub.

## Inspection Report

Setiap unit HP dapat memiliki laporan pemeriksaan.

Contoh parameter:

- Layar
- Touchscreen
- Kamera depan
- Kamera belakang
- Speaker
- Microphone
- Charging
- Wi-Fi
- Bluetooth
- SIM
- Sensor
- Fingerprint
- NFC
- Battery
- Tombol
- Kondisi body

Tahap awal cukup menggunakan parameter penting. Jumlah pemeriksaan dapat diperluas kemudian.

## Kondisi & Kekurangan

Contoh:

> Body terdapat gores ringan pada frame kanan.
> Back cover terdapat bekas pemakaian.

Kekurangan tidak boleh disembunyikan hanya demi terlihat lebih bagus.

## Grade

Sistem grade dapat digunakan untuk membantu pelanggan memahami kondisi dengan cepat.

Contoh:

- Grade A
- Grade B+
- Grade B
- Grade C

Definisi grade harus dibuat konsisten sebelum digunakan secara luas.

## Riwayat Unit

Setiap unit dapat memiliki ID internal.

Contoh:

`MGH-SAM-S23-00017`

Riwayat dapat berisi:

- tanggal masuk
- pemeriksaan
- servis
- sparepart yang diganti
- status QC
- status stok
- garansi

---

# 6. Struktur Website V1

## Beranda

Urutan prioritas:

1. Header
2. Hero
3. CTA utama
4. Kategori layanan
5. Produk terbaru
6. Produk tersedia
7. Mengapa Mubarok?
8. Cara kerja
9. Layanan servis
10. Tukar tambah
11. Testimoni
12. Lokasi/kontak
13. Footer

CTA utama:

- Beli HP
- Tukar Tambah
- Servis HP
- Sparepart

## Katalog

Fitur:

- Search
- Filter merek
- Filter harga
- Filter kondisi
- Filter stok
- Sorting
- Grid mobile-friendly
- Product card sederhana

## Detail Produk

Prioritas:

1. Foto unit
2. Nama/model
3. Harga
4. Status stok
5. Grade
6. Ringkasan kondisi
7. Kekurangan
8. Hasil pemeriksaan
9. Kelengkapan
10. Garansi
11. Riwayat unit
12. Video pengecekan jika tersedia
13. CTA WhatsApp

## Tukar Tambah

Tahap V1:

- Data pelanggan
- Merek/model
- Kondisi
- Kerusakan
- Foto
- Nomor WhatsApp
- Catatan
- Kirim permintaan

Penilaian harga dapat tetap manual pada tahap awal.

## Servis

Tahap V1:

- Nama
- WhatsApp
- Merek
- Model
- Keluhan
- Foto/video
- Jenis kerusakan
- Catatan
- Kirim permintaan

## Sparepart

- Katalog
- Model kompatibel
- Kondisi
- Status original/quality sesuai data sebenarnya
- Tested
- Harga
- Stok
- CTA kontak

---

# 7. Mobile UX

Target desain awal:

**390px smartphone viewport**

Prinsip:

- navigasi mudah dengan satu tangan
- tombol CTA cukup besar
- teks mudah dibaca
- kartu produk ringkas
- gambar tidak memenuhi bandwidth secara berlebihan
- informasi kondisi terlihat tanpa membuka banyak menu
- WhatsApp mudah ditemukan tetapi tidak mengganggu
- bottom navigation dapat digunakan bila memang meningkatkan UX

Desktop adalah tahap berikutnya, bukan dasar desain.

---

# 8. Identitas Visual

Arah visual:

- modern
- profesional
- bersih
- terpercaya
- tidak terlalu ramai
- terasa seperti toko teknologi
- tetap memiliki karakter lokal Mubarok

Hindari:

- terlalu banyak badge
- animasi berlebihan
- warna mencolok tanpa fungsi
- UI yang terasa seperti marketplace generik
- informasi penting disembunyikan dalam teks kecil

---

# 9. Arsitektur Implementasi Bertahap

## Fase 0 — Audit

- Audit repository
- Audit struktur aplikasi
- Audit dependency
- Audit konfigurasi OpenCode
- Pastikan baseline build

## Fase 1 — UI/UX Foundation

Fokus:

**Tampilan terlebih dahulu.**

Bangun:

- layout
- responsive design
- homepage
- katalog
- product detail
- tukar tambah
- servis
- sparepart
- kontak

Gunakan mock data.

Belum perlu backend kompleks.

## Fase 2 — Trust Layer

Tambahkan:

- inspection report
- grade
- kondisi
- kekurangan
- garansi
- riwayat unit
- video pemeriksaan

## Fase 3 — Data Layer

Tambahkan:

- database
- produk
- stok
- unit
- customer
- servis
- sparepart
- tukar tambah

## Fase 4 — Operasional

Tambahkan:

- admin
- inventory
- service tracking
- customer records
- transaksi
- status unit

## Fase 5 — Growth

Tambahkan:

- SEO
- analytics
- promo
- CRM
- laporan penjualan
- dashboard bisnis
- integrasi marketplace
- automation

---

# 10. Teknologi

Repository yang ada tetap menjadi baseline.

Jangan mengganti stack tanpa alasan kuat.

Setiap perubahan teknologi harus menjawab:

1. Apa masalahnya?
2. Mengapa stack sekarang tidak cukup?
3. Apa manfaatnya?
4. Apa risiko migrasinya?

---

# 11. Workflow Development

Gunakan pola:

**PLAN → BUILD → TEST → FIX → REVIEW → COMMIT**

Untuk setiap milestone:

1. Tentukan scope.
2. Buat checklist.
3. Implementasikan.
4. Jalankan build.
5. Jalankan lint/test yang tersedia.
6. Perbaiki error.
7. Review visual.
8. Commit.
9. Catat hasil.
10. Baru lanjut milestone berikutnya.

Jangan mengerjakan beberapa milestone besar sekaligus tanpa checkpoint.

---

# 12. Autonomous Agent Strategy

OpenCode digunakan sebagai developer agent untuk sprint.

Agent boleh bekerja otonom dalam scope proyek, tetapi aksesnya harus dibatasi.

Target:

- membaca repository
- mengedit kode
- menjalankan build
- menjalankan test/lint
- memperbaiki error
- membuat commit
- push ke repository yang ditentukan bila sudah diizinkan

Agent tidak boleh memperoleh akses yang tidak diperlukan seperti:

- credential utama
- private key yang tidak diperlukan
- repository lain
- data pribadi yang tidak diperlukan
- production secrets
- akses root bila tidak diperlukan

Gunakan permission policy dan credential dengan prinsip least privilege.

`--auto` hanya digunakan setelah pagar keamanan diverifikasi.

---

# 13. Git & Checkpoint

Setiap milestone penting harus menghasilkan commit yang jelas.

Contoh:

`feat: redesign mobile homepage`

`feat: add product detail inspection section`

`feat: add trade-in landing page`

`fix: mobile product grid overflow`

Hindari commit besar yang mencampur banyak fitur yang tidak berhubungan.

---

# 14. Definition of Done

Sebuah milestone dianggap selesai jika:

- fitur sesuai scope
- tidak merusak fitur sebelumnya
- responsive
- tampilan mobile diperiksa
- build berhasil
- lint/test yang tersedia berhasil
- tidak ada credential yang masuk ke repository
- tidak ada data sensitif yang hardcoded
- perubahan sudah di-commit
- hasil pekerjaan dicatat

---

# 15. Prioritas Fitur

## P0 — Bangun sekarang

- Homepage
- Mobile-first layout
- Katalog HP
- Product card
- Product detail
- Search
- Kategori
- CTA WhatsApp
- Tukar tambah
- Servis
- Sparepart
- Trust section
- Mock data

## P1 — Setelah UI V1 stabil

- Inspection report
- Grade
- Garansi
- Riwayat unit
- Video pemeriksaan
- Database
- Inventory

## P2 — Setelah operasional berjalan

- Admin dashboard
- Service tracking
- Customer management
- Trade-in management
- Sales dashboard
- Analytics

## P3 — Pengembangan jangka panjang

- Otomatisasi
- CRM
- Integrasi marketplace
- SEO lanjutan
- Sistem estimasi trade-in
- Loyalty/customer system
- Business intelligence

---

# 16. Hal yang TIDAK BOLEH Dilakukan Agent

1. Jangan mengubah tujuan bisnis tanpa instruksi.
2. Jangan mengganti stack hanya karena preferensi pribadi.
3. Jangan menghapus fitur yang sudah bekerja tanpa alasan.
4. Jangan memasukkan API key/token/password ke source code.
5. Jangan commit `.env` atau secret.
6. Jangan menghapus data production.
7. Jangan menjalankan destructive command di luar kebutuhan proyek.
8. Jangan menggunakan `sudo` kecuali secara eksplisit diperlukan dan disetujui.
9. Jangan mengubah konfigurasi VPS secara sembarangan.
10. Jangan memperluas scope milestone tanpa alasan.
11. Jangan menganggap mock data sebagai data produksi.
12. Jika requirement ambigu, catat sebagai TODO/blocked item daripada membuat asumsi berisiko.

---

# 17. Prinsip Bisnis Amanah

Website harus membantu penjual menjelaskan kondisi barang dengan jujur.

Jika terdapat:

- layar retak
- dead pixel
- burn-in
- battery menurun
- body penyok
- bekas servis
- sparepart pernah diganti
- fungsi tertentu bermasalah

maka informasi tersebut harus dapat ditampilkan dengan jelas bila memang diketahui.

Jangan menggunakan desain, foto, atau copywriting untuk membuat kondisi barang terlihat lebih baik daripada keadaan sebenarnya.

---

# 18. Arah Jangka Panjang

Visi akhirnya:

**Mubarok Gadget Hub**

├── HP Bekas  
├── HP Baru (jika nanti ada)  
├── Sparepart  
├── Servis  
├── Tukar Tambah  
├── QC / Inspection  
├── Riwayat Unit  
├── Garansi  
├── Customer  
├── Inventory  
├── CRM  
└── Business Intelligence

Namun seluruh sistem dibangun bertahap.

**Blueprint ini adalah arah besar, bukan daftar tugas yang harus diselesaikan sekaligus.**

---

# 19. Aturan untuk Sesi AI Berikutnya

Jika sesi AI terputus, buka kembali `BLUEPRINT.md` sebelum melanjutkan.

AI harus:

1. Membaca blueprint.
2. Memeriksa kondisi repository saat ini.
3. Menentukan milestone yang sedang aktif.
4. Tidak mengulang pekerjaan yang sudah selesai.
5. Tidak melompat ke milestone berikutnya tanpa menyelesaikan checkpoint.
6. Memprioritaskan P0 sebelum P1/P2/P3.
7. Mempertahankan prinsip amanah, transparansi, mobile-first, dan trust-first.

---

# 20. Current Project Status

**Project:** Mubarok Gadget Hub

**Repository:** `teknisiAkhirat/mubarok-gadget-hub`

**Current strategy:** UI/UX terlebih dahulu, fungsi/backend kemudian.

**Current priority:** Finalisasi blueprint → PRD V1 → UI/UX V1 → build → test → fix.

**Current autonomous development environment:**
- VPS Ubuntu
- OpenCode
- tmux untuk sesi panjang bila diperlukan

**Catatan keamanan:**
Credential dan permission agent belum dianggap final. Jangan memberikan credential berprivilege tinggi sebelum permission OpenCode diverifikasi.

---

## END OF BLUEPRINT
