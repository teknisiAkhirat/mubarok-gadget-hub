import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Repeat,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Wrench,
  Package,
  CheckCircle2,
  Eye,
  AlertTriangle,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroBanner from "@/assets/hero-banner.jpg";
import { mockBrands, mockCategories, type Product } from "@/lib/mock-data";
import { fetchProducts, seedIfEmpty } from "@/lib/products-db";
import { ProductCard } from "@/components/ProductCard";
import { WA_LINK, STORE } from "@/config/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mubarok Gadget Hub — HP Bekas & Sparepart Bergaransi Blora" },
      {
        name: "description",
        content:
          "HP bekas, sparepart, servis, dan tukar tambah di Blora, Jawa Tengah. Kondisi dijelaskan apa adanya. Garansi toko.",
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
        // silent
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
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
        <img
          src={heroBanner}
          alt="Mubarok Gadget Hub workshop"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          width={1920}
          height={800}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-orange)]" /> {STORE.city}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              HP Bekas Apa Adanya.{" "}
              <span className="text-[var(--color-accent-orange)]">Kondisi Dijelaskan.</span>
            </h1>
            <p className="mt-4 text-base opacity-90 md:text-lg">
              HP bekas, sparepart, servis, dan tukar tambah dengan informasi kondisi yang
              transparan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/produk"
                search={{ type: "hp-bekas" } as never}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-orange)] px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
              >
                Lihat HP <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tukar-tambah"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-semibold backdrop-blur hover:bg-white/20"
              >
                Tukar Tambah
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Services ─── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-center text-2xl font-bold">Layanan Kami</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              icon: Smartphone,
              title: "HP Bekas",
              desc: "Diperiksa, kondisi dijelaskan",
              to: "/produk",
              search: { type: "hp-bekas" },
              color: "bg-blue-50 text-blue-700",
            },
            {
              icon: Repeat,
              title: "Tukar Tambah",
              desc: "HP lama atau rusak?",
              to: "/tukar-tambah",
              color: "bg-green-50 text-green-700",
            },
            {
              icon: Wrench,
              title: "Servis HP",
              desc: "Teknisi berpengalaman",
              to: "/servis",
              color: "bg-orange-50 text-orange-700",
            },
            {
              icon: Package,
              title: "Sparepart",
              desc: "Sudah diuji, bergaransi",
              to: "/sparepart",
              color: "bg-purple-50 text-purple-700",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              search={"search" in item ? item.search : undefined}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Kategori Sparepart ─── */}
      <section className="mx-auto max-w-7xl px-4 py-6">
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
              to="/sparepart"
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent-orange)] hover:shadow-md"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-semibold text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Merek HP ─── */}
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

      {/* ─── Featured ─── */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Produk Unggulan</h2>
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
      )}

      {/* ─── Latest ─── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6">
          <h2 className="mb-5 text-2xl font-bold">Produk Terbaru</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Trust Section: Kenapa Beli di Mubarok? ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">Kenapa Beli di Mubarok?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Eye,
              title: "Kondisi Dijelaskan Apa Adanya",
              desc: "Kekurangan tidak disembunyikan. Anda tahu kondisi sebenarnya sebelum membeli.",
            },
            {
              icon: CheckCircle2,
              title: "Unit Diperiksa Sebelum Dijual",
              desc: "Setiap HP melalui pemeriksaan fungsional oleh teknisi kami.",
            },
            {
              icon: AlertTriangle,
              title: "Kekurangan Disebutkan",
              desc: "Retak, lecet, baterai drop — semua dicatat dan dijelaskan secara transparan.",
            },
            {
              icon: ShieldCheck,
              title: "Garansi Toko",
              desc: "Pembelian HP bekas mendapat garansi toko sesuai ketentuan.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <item.icon className="h-6 w-6 text-[var(--color-accent-orange)]" />
              <h3 className="mt-3 font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Cara Kerja ─── */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-center text-2xl font-bold">Cara Membeli</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Pilih HP",
                desc: "Jelajahi katalog dan temukan HP yang sesuai.",
              },
              {
                step: "2",
                title: "Cek Kondisi",
                desc: "Lihat hasil pemeriksaan, kekurangan, dan garansi.",
              },
              {
                step: "3",
                title: "Tanya",
                desc: "Chat via WhatsApp jika ada pertanyaan lebih lanjut.",
              },
              {
                step: "4",
                title: "Transaksi",
                desc: "Hubungi toko untuk proses pembelian dan pengiriman.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand)] text-lg font-bold text-[var(--color-brand-foreground)]">
                  {item.step}
                </div>
                <h3 className="mt-3 font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tukar Tambah CTA ─── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[var(--color-brand)] to-[#0f2440] p-8 text-[var(--color-brand-foreground)] shadow-lg md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-[var(--color-accent-orange)] px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Tukar Tambah
              </span>
              <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">
                Punya HP lama atau HP rusak?
              </h3>
              <p className="mt-2 max-w-xl text-sm opacity-90">
                Kami terima berbagai kondisi — dari normal sampai rusak parah. Dapatkan penawaran
                harga terbaik.
              </p>
            </div>
            <Link
              to="/tukar-tambah"
              className="shrink-0 rounded-lg bg-[var(--color-accent-orange)] px-6 py-3 font-bold text-white shadow-lg hover:scale-[1.02]"
            >
              Coba Tukar Tambah →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Servis CTA ─── */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                Servis HP
              </span>
              <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">HP Bermasalah?</h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Kirim keluhan dan biarkan kami memeriksanya terlebih dahulu. Harga ditentukan
                setelah pemeriksaan.
              </p>
            </div>
            <Link
              to="/servis"
              className="shrink-0 rounded-lg bg-[var(--color-brand)] px-6 py-3 font-bold text-[var(--color-brand-foreground)] shadow-lg hover:scale-[1.02]"
            >
              Konsultasi Servis →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Lokasi & Kontak ─── */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-center text-2xl font-bold">Lokasi & Kontak</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <MapPin className="mx-auto h-6 w-6 text-[var(--color-accent-orange)]" />
              <h3 className="mt-2 font-bold">Alamat</h3>
              <p className="mt-1 text-sm text-muted-foreground">{STORE.address}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <Clock className="mx-auto h-6 w-6 text-[var(--color-accent-orange)]" />
              <h3 className="mt-2 font-bold">Jam Operasional</h3>
              <p className="mt-1 text-sm text-muted-foreground">{STORE.operationalHours}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <MessageCircle className="mx-auto h-6 w-6 text-[var(--color-accent-orange)]" />
              <h3 className="mt-2 font-bold">WhatsApp</h3>
              <a
                href={WA_LINK.general()}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
              >
                Chat Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
