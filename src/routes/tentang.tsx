import { createFileRoute } from "@tanstack/react-router";
import { mockSeller } from "@/lib/mock-data";
import { waLink } from "@/lib/format";
import { MapPin, Clock, ShieldCheck, MessageCircle, Truck, Repeat, Award } from "lucide-react";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — Mubarok Smartphone Sales and Services" },
      {
        name: "description",
        content:
          "Mengenal Mubarok Smartphone Sales & Service, toko HP bekas bergaransi di Jalan Jatirogo Gang Wali Songo No. 40, Jepon, Blora.",
      },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 transition-all duration-300">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-3xl font-extrabold md:text-4xl">
          Tentang Mubarok Smartphone Sales and Services
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Toko smartphone bekas bergaransi dan servis HP terpercaya di Jepon, Blora.
        </p>
      </section>

      {/* Cerita Kami */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Cerita Kami</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Mubarok Smartphone Sales & Service didirikan dengan komitmen memberikan solusi
            smartphone bekas berkualitas tinggi yang transparan, amanah, serta dilengkapi garansi
            toko untuk ketenangan pikiran pelanggan.
          </p>
          <p>
            Kami melayani dengan prinsip kejujuran. Setiap unit yang ditawarkan telah melalui tahap
            seleksi dan uji kelayakan teknis yang teliti sebelum sampai ke tangan pembeli.
          </p>
        </div>
      </section>

      {/* Mengapa Pilih Kami */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Mengapa Pilih Kami?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Garansi Toko</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Setiap pembelian dilengkapi garansi toko resmi. Transaksi tenang dan amanah.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Award className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Seleksi Ketat</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pengecekan fungsi hardware dan software secara mendalam sebelum produk dipasarkan.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Repeat className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Tukar Tambah</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Fasilitas tukar tambah perangkat lama langsung di alamat toko kami dengan penaksiran
              wajar.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Truck className="h-8 w-8 text-[var(--color-accent-orange)]" />
            <h3 className="mt-3 font-bold">Pengiriman Aman</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Melayani pengiriman ekspedisi terpercaya ke berbagai wilayah.
            </p>
          </div>
        </div>
      </section>

      {/* Lokasi & Jam Operasional */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Lokasi & Jam Operasional Toko</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">{mockSeller.storeName}</h3>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Jalan Jatirogo Gang Wali Songo No. 40
                </p>
                <p className="text-sm text-muted-foreground">Jepon, Blora, Jawa Tengah</p>
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
                <p className="mt-1 text-sm font-semibold text-foreground">Senin s/d Sabtu</p>
                <p className="text-sm text-muted-foreground">Pukul 09.00 – 15.00 WIB</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Respon Cepat & Transparan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-[var(--color-brand)] to-[#0f2440] p-8 text-[var(--color-brand-foreground)] md:p-12 shadow-md">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-extrabold">Kunjungi Toko Kami atau Konsultasi Online</h3>
            <p className="mt-2 max-w-xl text-sm opacity-90">
              Silakan mampir ke Jl. Jatirogo Gg. Wali Songo No. 40, Jepon, Blora atau hubungi via
              WhatsApp.
            </p>
          </div>
          <a
            href={waLink("Halo Mubarok SMS&S, saya ingin berkunjung ke toko / konsultasi.")}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg bg-[var(--color-accent-orange)] px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="mr-2 inline h-4 w-4" /> Chat WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
