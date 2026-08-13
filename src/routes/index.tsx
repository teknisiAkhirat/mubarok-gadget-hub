import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Repeat, ShieldCheck, Sparkles, Truck, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import heroBanner from "@/assets/hero-banner.jpg";
import { mockBrands, mockCategories, type Product } from "@/lib/mock-data";
import { fetchProducts, seedIfEmpty } from "@/lib/products-db";
import { ProductCard } from "@/components/ProductCard";
import { StoreInfoCard } from "@/components/StoreInfoCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mubarok SMS&S — HP Bekas Normal & Sparepart Bergaransi Blora" },
      {
        name: "description",
        content:
          "Marketplace HP bekas bergaransi dan sparepart smartphone di Blora. Tukar-tambah, garansi toko, respon cepat.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await seedIfEmpty();
        const data = await fetchProducts();
        if (mounted) setProducts(data.filter((p) => p.isActive));
      } catch {
        // silent — etalase kosong lebih baik daripada crash
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const featured = products.filter((p) => p.isFeatured);
  const latest = [...products].sort((a, b) => +b.createdAt - +a.createdAt);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
        <img
          src={heroBanner}
          alt="Mubarok smartphone service workshop"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          width={1920}
          height={800}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-orange)]" /> Blora, Jawa
              Tengah
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              HP Bekas Normal & Sparepart{" "}
              <span className="text-[var(--color-accent-orange)]">Bergaransi</span>
            </h1>
            <p className="mt-4 text-base opacity-90 md:text-lg">
              Smartphone bekas berkualitas dan sparepart original. Terima tukar-tambah dengan harga
              terbaik di Blora dan sekitarnya.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/produk"
                search={{ type: "hp-bekas" } as never}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-orange)] px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
              >
                📱 Belanja HP Bekas <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/produk"
                search={{ type: "sparepart" } as never}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-semibold backdrop-blur hover:bg-white/20"
              >
                🔧 Cari Sparepart
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--color-accent-orange)]" /> Garansi Toko
              </div>
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-[var(--color-accent-orange)]" /> Tukar-Tambah
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[var(--color-accent-orange)]" /> Kirim ke Seluruh
                Indonesia
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Barang Teruji</p>
              <p className="text-xs text-muted-foreground">Sebelum dijual</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Garansi Toko</p>
              <p className="text-xs text-muted-foreground">3-14 hari</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Tukar Tambah</p>
              <p className="text-xs text-muted-foreground">HP lama kamu</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Kirim Indonesia</p>
              <p className="text-xs text-muted-foreground">Aman & cepat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kategori Sparepart */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Kategori Sparepart</h2>
            <p className="text-sm text-muted-foreground">
              Cari komponen sesuai kebutuhan perbaikan HP-mu.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to="/produk"
              search={{ type: "sparepart", category: cat.slug } as never}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent-orange)] hover:shadow-md"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-semibold text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Merek HP */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <h2 className="mb-4 text-2xl font-bold">Belanja per Merek HP</h2>
        <div className="flex flex-wrap gap-2">
          {mockBrands.map((b) => (
            <Link
              key={b.id}
              to="/produk"
              search={{ brand: b.slug } as never}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--color-brand-foreground)]"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold">⭐ Produk Unggulan</h2>
          <Link
            to="/produk"
            className="text-sm font-semibold text-[var(--color-accent-orange)] hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <h2 className="mb-5 text-2xl font-bold">🆕 Produk Terbaru</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Tukar tambah banner */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[var(--color-brand)] to-[#0f2440] p-8 text-[var(--color-brand-foreground)] shadow-lg md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-[var(--color-accent-orange)] px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Tukar-Tambah
              </span>
              <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">
                Punya HP lama? Tukar-tambah di sini!
              </h3>
              <p className="mt-2 max-w-xl text-sm opacity-90">
                Lihat estimasi harga tukar-tambah HP-mu dan konfirmasi via WhatsApp.
              </p>
            </div>
            <Link
              to="/tukar-tambah"
              className="shrink-0 rounded-lg bg-[var(--color-accent-orange)] px-6 py-3 font-bold text-white shadow-lg hover:scale-[1.02]"
            >
              Lihat Estimasi Harga →
            </Link>
          </div>
        </div>
      </section>

      {/* Servis HP Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white shadow-lg md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Servis HP
              </span>
              <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">
                Servis HP di Mubarok SMS&S
              </h3>
              <p className="mt-2 max-w-xl text-sm opacity-90">
                Teknisi berpengalaman. Penggantian LCD, baterai, charging port, hingga perbaikan IC
                dan motherboard.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/service-new"
                className="shrink-0 rounded-lg bg-white px-6 py-3 font-bold text-green-700 shadow-lg hover:scale-[1.02]"
              >
                Buat Tiket Servis
              </Link>
              <Link
                to="/repair-tracker"
                className="shrink-0 rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-bold backdrop-blur hover:bg-white/20"
              >
                Lacak Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Toko Info */}
      <StoreInfoCard />
    </div>
  );
}
