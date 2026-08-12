import { createFileRoute } from "@tanstack/react-router";
import { mockSeller } from "@/lib/mock-data";
import { waLink } from "@/lib/format";
import {
  MapPin,
  Clock,
  ShieldCheck,
  MessageCircle,
  Star,
  Truck,
  Repeat,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — Mubarok SMS&S" },
      {
        name: "description",
        content:
          "Mengenal Mubarok Smartphone Sales & Service, toko HP bekas bergaransi di Blora, Jawa Tengah.",
      },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-3xl font-extrabold md:text-4xl">Tentang Mubarok SMS&S</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Toko smartphone bekas bergaransi dan servis HP terpercaya di Blora, Jawa Tengah.
        </p>
      </section>

      {/* Cerita Kami */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Cerita Kami</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Mubarok Smartphone Sales & Service didirikan dengan visi sederhana: menyediakan
            smartphone bekas berkualitas tinggi dengan harga terjangkau, dilengkapi garansi toko
            untuk ketenangan pikiran pelanggan.
          </p>
          <p>
            Kami memahami bahwa tidak semua orang mampu membeli smartphone baru. Oleh karena itu,
            kami hadir untuk memberikan alternatif yang aman dan terpercaya — smartphone bekas yang
            sudah kami seleksi dan uji kelayakannya sebelum dijual.
          </p>
          <p>
            Selain menjual smartphone dan sparepart, kami juga melayani servis HP dengan teknisi
            berpengalaman. Dari penggantian LCD, baterai, hingga perbaikan IC dan motherboard.
          </p>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Mengapa Pilih Kami?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Garansi Toko</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Setiap pembelian dilengkapi garansi toko 3-14 hari. Jika ada masalah, kami ganti atau
              perbaiki.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Award className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Seleksi Ketat</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Setiap unit yang kami jual sudah melalui pengecekan kualitas. Kami hanya menjual
              barang yang layak pakai.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Repeat className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Tukar Tambah</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Punya HP lama? Tukar tambah di sini! Dapatkan penawaran harga terbaik untuk HP lamamu.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Truck className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Kirim Seluruh Indonesia</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Berlokasi di Blora, Jawa Tengah. Kami melayani pengiriman ke seluruh Indonesia via
              ekspedisi terpercaya.
            </p>
          </div>
        </div>
      </section>

      {/* Lokasi & Jam Operasional */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Lokasi & Jam Operasional</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">{mockSeller.storeName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{mockSeller.city}</p>
                <p className="mt-2 text-sm text-muted-foreground">{mockSeller.description}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-orange)] text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Jam Operasional</h3>
                <p className="mt-1 text-sm text-muted-foreground">{mockSeller.operationalHours}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{mockSeller.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({mockSeller.ratingCount} ulasan)
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Toko Terverifikasi · Respon {mockSeller.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-[var(--color-brand)] to-[#0f2440] p-8 text-[var(--color-brand-foreground)] md:p-12">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-extrabold">Siap Berbelanja atau Servis HP?</h3>
            <p className="mt-2 max-w-xl text-sm opacity-90">
              Hubungi kami via WhatsApp untuk konsultasi, tanya stok, atau buat janji servis.
            </p>
          </div>
          <a
            href={waLink("Halo Mubarok SMS&S, saya ingin bertanya.")}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg bg-[var(--color-accent-orange)] px-6 py-3 font-bold text-white shadow-lg hover:scale-[1.02]"
          >
            <MessageCircle className="mr-2 inline h-4 w-4" /> Chat WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
