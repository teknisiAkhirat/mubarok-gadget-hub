# SPRINT 1 STATUS — Mubarok Gadget Hub (UI/UX Foundation)

> Milestone 0 — Audit status repo terhadap checklist PRD-V1.md Section 20 & SPRINT_1_UIUX_TASK.md.
> Branch: `clean-rebuild` · Tanggal audit: 13 Agustus 2026

## Ringkasan Temuan

React 19 + TanStack Router/Start + Tailwind v4 + shadcn-style sudah kokoh.
Sebagian besar item PRD sudah ada (>60%). Gaps utama:
- Homepage: copy hero belum sesuai positioning, quick services belum berbentuk 4 kartu layanan, belum ada trust section "Kenapa Beli di Mubarok?", belum ada cara kerja, belum ada testimoni (mock).
- Katalog: belum ada filter kondisi & stok, filter mobile masih sidebar penuh (belum bottom sheet/drawer).
- Detail produk: belum ada grade, defect disclosure, inspection summary, kelengkapan.
- Servis & tukar tambah: form masih sebagian, belum ada upload foto/video, belum ada checklist kondisi & success state penuh.
- Form validation & states, aksesibilitas pointer target, dan beberapa item SEO perlu diselesaikan.

---

## Per-Item Checklist PRD Section 20

### Foundation
| Item | Status | Catatan |
|---|---|---|
| Audit struktur UI existing | ✅ Sudah | Repo sudah teraudit & rapi (42 file usang dihapus) |
| Pertahankan stack yang ada | ✅ Sudah | React 19, TanStack, Tailwind v4, shadcn-style dipertahankan |
| Tentukan design tokens | ✅ Sudah | `src/styles.css` — brand navy + accent orange + radius + font |
| Rapikan global layout | ✅ Sudah | `__root.tsx`: Header + `<Outlet />` + Footer + Toaster |
| Mobile-first breakpoints | 🔶 Partial | Grid 2 kolom mobile sudah; beberapa target kecil perlu QC |

### Homepage
| Item | Status | Catatan |
|---|---|---|
| Header | ✅ Sudah | Logo, search, brand select, menu mobile dropdown, cart |
| Hero | 🔶 Partial | Ada, tetapi copy belum "HP Bekas Apa Adanya. Kondisi Dijelaskan." |
| CTA | 🔶 Partial | Ada CTA ke katalog; perlu CTA Tukar Tambah di hero |
| Quick services | ❌ Belum | Saat ini kategori sparepart + brand chips; PRD: 4 kartu layanan |
| Product section | ✅ Sudah | Produk Unggulan + Produk Terbaru |
| Trust section | 🔶 Partial | Ada badge; belum articulasi "Kenapa Beli di Mubarok?" |
| How it works / Cara kerja | ❌ Belum | Belum ada "Pilih HP → Cek Kondisi → Tanya → Transaksi" |
| Trade-in CTA | ✅ Sudah | Banner tukar tambah ada |
| Service CTA | ✅ Sudah | Banner servis ada |
| Contact | ✅ Sudah | `StoreInfoCard` alamat/jam/WA |
| Footer | ✅ Sudah | Informasi toko, alamat, menu, kontak WA |

### Catalog
| Item | Status | Catatan |
|---|---|---|
| Search | ✅ Sudah | Header + hasil produk |
| Filter UI | 🔶 Partial | Merek + harga + kategori; belum kondisi/stok |
| Sort UI | ✅ Sudah | Terbaru/Termurah/Termahal/Terlaris |
| Product grid | ✅ Sudah | 2 kolom mobile |
| Product card | 🔶 Partial | Ada kondisi; indikator cacat belum eksplisit |
| Empty state | ✅ Sudah | "Produk tidak ditemukan" |

### Product detail
| Item | Status | Catatan |
|---|---|---|
| Gallery | ✅ Sudah | Gambar + thumbnail |
| Price | ✅ Sudah | Harga jelas |
| Stock | ✅ Sudah | Label stok |
| Grade | ❌ Belum | Belum ada sistem grade (A/B+/B/C) |
| Condition | ✅ Sudah | `conditionNote` + badge kondisi |
| Defect disclosure | ❌ Belum | Belum ada box "Kekurangan Unit" yang menonjol |
| Inspection | ❌ Belum | Belum ada tabel ringkasan pemeriksaan |
| Warranty | ✅ Sudah | `product.warranty` |
| CTA | ✅ Sudah | Keranjang + WA |

### Service
| Item | Status | Catatan |
|---|---|---|
| Landing UI | 🔶 Partial | `service-new` fokus admin tiket |
| Form | 🔶 Partial | Belum ada jenis kerusakan & upload foto/video |
| Error state | ❌ Belum | Belum lengkap |
| Success state | 🔶 Partial | Toast + redirect ke tracker |

### Trade-in
| Item | Status | Catatan |
|---|---|---|
| Landing UI | 🔶 Partial | Estimator ada; belum form pengajuan penuh |
| Form | 🔶 Partial | Belum nama/WA/kerusakan/foto/catatan |
| Upload UI | ❌ Belum | Belum ada |
| Success state | ❌ Belum | Belum ada |

### Sparepart
| Item | Status | Catatan |
|---|---|---|
| Catalog | ✅ Sudah | Mode sparepart di `/produk` |
| Product card | 🔶 Partial | Kompatibilitas terlihat; status original/quality perlu eksplisit |
| Detail | 🔶 Partial | PDP bersama, cocok untuk sparepart |
| CTA | ✅ Sudah | "Pesan via WhatsApp" |

---

## Rencana Milestone Berdasarkan Audit

1. **M1 Foundation**: design tokens sudah konsisten → verifikasi & rapikan; pertahankan stack. *(skip besar, verifikasi saja)*
2. **M2 Homepage**: hero copy, 4 kartu quick services, trust section, cara kerja, testimoni mock.
3. **M3 Katalog**: filter kondisi/stok, mobile filter drawer/bottom sheet, indikator cacat eksplisit di product card.
4. **M4 Detail Produk**: grade, defect disclosure, inspection summary, kelengkapan, urutan ulang per PRD.
5. **M5 Servis & Tukar Tambah**: kelengkapan form + upload foto/video mock + copy wajib + checklist kondisi.
6. **M6 Sparepart**: status original/quality eksplisit, CTA "Tanya Sparepart".
7. **M7 Form validation & states**: error/success state semua form, loading state.
8. **M8 Responsive & accessibility**: QC 360/390/412, target ≥44px, label, alt text.
9. **M9 SEO**: title/meta tiap halaman, heading semantic.
10. **M10 Final review & build**: `npm run build` + `npm run lint` bersih, status final.