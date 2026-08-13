import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Repeat,
  ShieldCheck,
  Sparkles,
  Truck,
  CheckCircle,
  Smartphone,
  Wrench,
  Package,
  Search,
  MessageCircle,
  MapPin,
  Clock,
  Menu,
  Bug,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroBanner from "@/assets/hero-banner.jpg";
import { mockBrands, mockSeller, type Product } from "@/lib/mock-data";
import { fetchProducts, seedIfEmpty } from "@/lib/products-db";
import { ProductCard } from "@/components/ProductCard";
import { StoreInfoCard } from "@/components/StoreInfoCard";
import { waLink } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mubarok Gadget Hub — HP Bekas Apa Adanya, Kondisi Dijelaskan · Blora" },
      {
        name: "description",
        content:
          "Jual HP bekas, sparepart, servis, dan tukar tambah dengan informasi kondisi yang transparan. Blora, Jawa Tengah. Garansi toko.",
      },
    ],
  }),
  component: HomePage,
});

const QUICK_SERVICES = [
  {
    title: "HP Bekas",
    desc: "Kondisi dan kekurangan dijelaskan apa adanya.",
    icon: Smartphone,
    to: "/produk" as const,
    search: { type: "hp-bekas" },
    cta: "Lihat HP",
  },
  {
    title: "Tukar Tambah",
    desc: "HP lama atau rusak dapat diterima.",
    icon: Repeat,
    to: "/tukar-tambah" as const,
    search: {},
    cta: "Coba Tukar Tambah",
  },
  {
    title: "Servis HP",
    desc: "Kirim keluhan, kami periksa dulu.",
    icon: Wrench,
    to: "/servis" as const,
    search: {},
    cta: "Konsultasi Servis",
  },
  {
    title: "Sparepart",
    desc: "Original copotan & compatible, tested.",
    icon: Package,
    to: "/produk" as const,
    search: { type: "sparepart" },
    cta: "Cari Sparepart",
  },
];

const TRUST_POINTS = [
  {
    icon: Search,
    title: "Kondisi Dijelaskan Apa Adanya",
    desc: "Layar, body, baterai — apa adanya, tanpa ditutup-tutupi.",
  },
  {
    icon: CheckCircle,
    title: "Unit Diperiksa Sebelum Dijual",
    desc: "Fungsi hardware dicek sebelum unit dipasarkan.",
  },
  {
    icon: Bug,
    title: "Kekurangan Disebutkan",
    desc: "Gores, bekas pemakaian, bagian yang tidak sempurna disebut di halaman produk.",
  },
  {
    icon: ShieldCheck,
    title: "Garansi Toko Sesuai Ketentuan",
    desc: "Ada garansi toko untuk tiap unit yang dijual.",
  },
];

const HOW_IT_WORKS = ["Pilih HP", "Cek Kondisi", "Tanya", "Transaksi"];

const TESTIMONIALS = [
  {
    name: "Contoh Pembeli A",
    text: "Kondisi HP sesuai deskripsi, kekurangannya juga disebut. Prosesnya jelas.",
  },
  {
    name: "Contoh Pembeli B",
    text: "Tukar tambah HP lama saya diproses mudah dan penjelasannya transparan.",
  },
  {
    name: "Contoh Pembeli C",
    text: "Servis cepat, teknisi menjelaskan sebelum tindakan. Amanah.",
  },
];

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
          alt="Mubarok gadget shop service and phone repair"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          width={1920}
          height={800}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-orange)]" /> Blora, Jawa
              Tengah
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
              HP Bekas Apa Adanya. <br className="hidden sm:block" />{" "}
              <span className="text-[var(--color-accent-orange)]">Kondisi Dijelaskan.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base opacity-90 md:text-lg">
              HP bekas, sparepart, servis, dan tukar tambah dengan informasi kondisi yang transparan
              dan garansi toko.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/produk"
                search={{ type: "hp-bekas" } as never}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-orange)] px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-105"
              >
                <Smartphone className="h-4 w-4" /> Lihat HP <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tukar-tambah"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-semibold backdrop-blur hover:bg-white/20"
              >
                <Repeat className="h-4 w-4" /> Tukar Tambah
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--color-accent-orange)]" /> Garansi Toko
              </div>
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-[var(--color-accent-orange)]" /> Tukar Tambah
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[var(--color-accent-orange)]" /> Kirim ke Indonesia
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services — 4 kartu */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {QUICK_SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <Link
                key={svc.title}
                to={svc.to}
                search={svc.search as never}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent-orange)] hover:shadow-md"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold md:text-base">{svc.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{svc.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-orange)]">
                  {svc.cta}{" "}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Produk unggulan */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Produk Unggulan</h2>
            <p className="text-sm text-muted-foreground">HP dan sparepart pilihan yang tersedia.</p>
          </div>
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

      {/* Trust section — Kenapa Beli di Mubarok? */}
      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold">Kenapa Beli di Mubarok?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prinsip kami: amanah, transparan, dan menjelaskan kondisi apa adanya.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="rounded-xl border border-border bg-background p-5">
                  <Icon className="h-6 w-6 text-[var(--color-accent-orange)]" />
                  <h3 className="mt-3 font-bold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produk terbaru */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-2xl font-bold">Produk Terbaru</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {latest.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Cara kerja */}
      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold">Cara Kerja</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Transaksi sederhana dan transparan dari awal hingga akhir.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-bold text-[var(--color-brand-foreground)]">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tukar tambah CTA */}
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
                Ceritakan kondisi HP-mu dan kirim pengajuan. Penilaian awal dibantu toko, konfirmasi
                via WhatsApp.
              </p>
            </div>
            <Link
              to="/tukar-tambah"
              className="shrink-0 rounded-lg bg-[var(--color-accent-orange)] px-6 py-3 font-bold text-white shadow-lg hover:brightness-105"
            >
              Coba Tukar Tambah →
            </Link>
          </div>
        </div>
      </section>

      {/* Servis CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white shadow-lg md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Servis HP
              </span>
              <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">HP Bermasalah?</h3>
              <p className="mt-2 max-w-xl text-sm opacity-90">
                Kirim keluhan dan biarkan kami memeriksanya terlebih dahulu. Harga dan tindakan
                perbaikan ditentukan setelah pemeriksaan kondisi perangkat.
              </p>
            </div>
            <Link
              to="/servis"
              className="shrink-0 rounded-lg bg-white px-6 py-3 font-bold text-green-700 shadow-lg hover:bg-green-50"
            >
              Konsultasi Servis
            </Link>
          </div>
        </div>
      </section>

      {/* Testimoni — mock yang jelas terlihat placeholder */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-2xl font-bold">Kata Mereka</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Contoh ulasan pengembangan — bukan data pelanggan asli.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-5">
              <div className="flex text-yellow-400" aria-label="Rating 5 dari 5">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} aria-hidden>
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <p className="mt-4 text-sm font-semibold">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lokasi & kontak */}
      <StoreInfoCard />

      {/* Footer contact strip */}
      <section className="border-t border-border bg-muted/40 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Menu className="h-4 w-4 text-[var(--color-accent-orange)]" />
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> Jl. Jatirogo Gg. Wali Songo No. 40, Jepon, Blora
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {mockSeller.operationalHours}
            </span>
          </div>
          <a
            href={waLink("Halo Mubarok Gadget Hub, saya ingin bertanya.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" /> Chat WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
