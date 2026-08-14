# Schema: Tabel `tickets`

Dokumentasi ini mendefinisikan struktur tabel yang akan dipakai ketika aplikasi dihubungkan ke database (D1 atau Supabase).

---

## Tabel `tickets`

| Kolom               | Tipe                   | Nullable | Default             | Keterangan                                                 |
| ------------------- | ---------------------- | -------- | ------------------- | ---------------------------------------------------------- |
| `id`                | `TEXT PRIMARY KEY`     | —        | —                   | ID unik tiket (misal: `tkt-1723456789`)                    |
| `ticket_number`     | `TEXT UNIQUE NOT NULL` | —        | —                   | Nomor tiket yang ditampilkan ke user (misal: `SRV-001234`) |
| `customer_name`     | `TEXT NOT NULL`        | —        | —                   | Nama pelanggan                                             |
| `customer_phone`    | `TEXT`                 | YES      | `NULL`              | Nomor HP pelanggan                                         |
| `device_model`      | `TEXT NOT NULL`        | —        | —                   | Model/device yang diservis                                 |
| `issue_description` | `TEXT NOT NULL`        | —        | —                   | Keluhan awal dari pelanggan                                |
| `diagnosis`         | `TEXT`                 | YES      | `NULL`              | Diagnosis teknisi (IC, jumper, dll)                        |
| `sparepart_cost`    | `INTEGER NOT NULL`     | —        | `0`                 | Biaya sparepart dalam Rupiah                               |
| `service_cost`      | `INTEGER NOT NULL`     | —        | `0`                 | Biaya jasa servis dalam Rupiah                             |
| `total_cost`        | `INTEGER NOT NULL`     | —        | `0`                 | Total biaya (`sparepart_cost + service_cost`)              |
| `status`            | `TEXT NOT NULL`        | —        | `'Menunggu'`        | Status servis (lihat enum di bawah)                        |
| `notes`             | `TEXT`                 | YES      | `NULL`              | Catatan teknisi                                            |
| `created_at`        | `TEXT NOT NULL`        | —        | `CURRENT_TIMESTAMP` | Waktu pembuatan tiket (ISO 8601)                           |
| `updated_at`        | `TEXT NOT NULL`        | —        | `CURRENT_TIMESTAMP` | Waktu terakhir update (ISO 8601)                           |

---

## Enum `status`

Nilai yang valid untuk kolom `status`:

| Value        | Keterangan                                            |
| ------------ | ----------------------------------------------------- |
| `Menunggu`   | Tiket baru dibuat, menunggu antrean                   |
| `Dikerjakan` | Sedang dalam proses perbaikan                         |
| `Selesai`    | Perbaikan selesai, siap diambil                       |
| `Gagal`      | Perbaikan tidak berhasil / unit tidak bisa diperbaiki |

---

## Index yang Direkomendasikan

```sql
CREATE UNIQUE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);
```

---

## Relasi (Opsional, untuk pengembangan lanjutan)

Tabel ini berdiri sendiri tanpa foreign key. Jika nanti ditambahkan tabel `customers` atau `products`, relasi bisa ditambahkan via:

- `customer_id` → tabel `customers(id)` (jika ada sistem multi-customer)
- `product_id` → tabel `products(id)` (jika servis terkait produk tertentu)

---

## Catatan Implementasi

- **Saat ini**: Data disimpan di `localStorage` via `LocalStorageTicketRepository`.
- **Target**: Setelah connect database, ganti implementasi di `src/lib/repositories/index.ts` ke `DatabaseTicketRepository`.
- **Tipe data**: Menggunakan `TEXT` untuk tanggal (ISO 8601) agar kompatibel dengan berbagai database.
- **Biaya**: Menggunakan `INTEGER` (Rupiah tanpa desimal) karena semua transaksi dalam nominal bulat.
