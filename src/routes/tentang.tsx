import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ShieldCheck,
  Eye,
  AlertTriangle,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { STORE, WA_LINK } from "@/config/constants";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami · Mubarok Gadget Hub" },
      {
        name: "description",
        content:
          "Mubarok Gadget Hub — toko HP bekas, sparepart, servis, dan tukar tambah di Blora, Jawa Tengah. Amanah dan transparan.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Tentang Kami</span>
      </nav>

      {/* Hero */}
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[#0f2440] p-6 text-[var(--color-brand-foreground)] md:p-10">
        <h1 className="text-3xl font-extrabold md:text-4xl">Tentang {STORE.name}</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed opacity-90 md:text-base">
          Kami adalah toko yang menjual HP bekas, sparepart, menerima servis, dan tukar tambah. Yang
          membedakan kami: kami menjelaskan kondisi barang dengan jujur.
        </p>
      </section>

      {/* Prinsip Kami */}
      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">Prinsip Kami</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: ShieldCheck,
              title: "Amanah",
              desc: "Kami tidak menyembunyikan cacat atau kekurangan barang. Apa adanya.",
            },
            {
              icon: Eye,
              title: "Transparan",
              desc: "Kondisi HP dijelaskan dengan jelas — termasuk kekurangan yang mungkin tidak terlihat di foto.",
            },
            {
              icon: CheckCircle2,
              title: "Diperiksa Sebelum Dijual",
              desc: "Setiap unit melalui pemeriksaan fungsional sebelum kami tawarkan kepada Anda.",
            },
            {
              icon: AlertTriangle,
              title: "Jujur soal Kekurangan",
              desc: "Layar retak? Baterai drop? Body lecet? Kami sebutkan. Anda berhak tahu sebelum membeli.",
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

      {/* Layanan Kami */}
      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">Layanan Kami</h2>
        <div className="space-y-3">
          {[
            {
              title: "HP Bekas Bergaransi",
              desc: "Smartphone bekas yang sudah diperiksa, dengan informasi kondisi yang jelas dan garansi toko.",
              link: "/produk",
              linkLabel: "Lihat Katalog",
            },
            {
              title: "Tukar Tambah",
              desc: "Tukar HP lama Anda dengan HP lain. Kami terima berbagai kondisi — dari normal sampai rusak.",
              link: "/tukar-tambah",
              linkLabel: "Ajukan Tukar Tambah",
            },
            {
              title: "Servis HP",
              desc: "Perbaikan HP oleh teknisi berpengalaman. Harga transparan, persetujuan sebelum dikerjakan.",
              link: "/servis",
              linkLabel: "Ajukan Servis",
            },
            {
              title: "Sparepart",
              desc: "Komponen HP bekas berkualitas — LCD, baterai, kamera, dan lainnya. Sudah diuji.",
              link: "/sparepart",
              linkLabel: "Lihat Sparepart",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Link
                to={item.link}
                className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
              >
                {item.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Bagaimana Kami Memeriksa */}
      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">Bagaimana Kami Memeriksa Barang</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Setiap HP bekas yang masuk ke toko kami melalui proses pemeriksaan:
          </p>
          <ol className="mt-4 space-y-3 text-sm">
            {[
              "Pemeriksaan fisik — body, layar, tombol, port",
              "Pemeriksaan fungsi — touchscreen, kamera, speaker, mic, WiFi, Bluetooth, sensor",
              "Pemeriksaan baterai — kapasitas dan kondisi",
              "Pencatatan kekurangan — semua cacat dicatat dan akan dijelaskan kepada pembeli",
              "Penentuan kondisi — unit dikategorikan berdasarkan kondisi nyata",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-xs font-bold text-[var(--color-brand-foreground)]">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted-foreground">
            * Pemeriksaan dilakukan secara manual oleh teknisi kami. Detail pemeriksaan lengkap
            tersedia di halaman detail produk.
          </p>
        </div>
      </section>

      {/* Garansi */}
      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">Kebijakan Garansi</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Garansi Toko:</strong> Setiap pembelian HP bekas
              mendapat garansi toko sesuai yang tercantum di detail produk (contoh: 30 hari).
            </li>
            <li>
              <strong className="text-foreground">Cakupan:</strong> Garansi mencakup kerusakan
              fungsional yang tidak dijelaskan sebelumnya. Kerusakan fisik yang sudah dijelaskan
              saat pembelian tidak termasuk klaim.
            </li>
            <li>
              <strong className="text-foreground">Klaim:</strong> Hubungi kami via WhatsApp dengan
              menyertakan nomor pesanan dan foto/video kondisi.
            </li>
            <li>
              <strong className="text-foreground">Sparepart:</strong> Garansi sparepart terpisah,
              biasanya 3 hari untuk komponen.
            </li>
          </ul>
        </div>
      </section>

      {/* Lokasi & Kontak */}
      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">Lokasi & Kontak</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-orange)]" />
              <div>
                <h3 className="font-bold">Alamat</h3>
                <p className="mt-1 text-sm text-muted-foreground">{STORE.address}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-orange)]" />
              <div>
                <h3 className="font-bold">Jam Operasional</h3>
                <p className="mt-1 text-sm text-muted-foreground">{STORE.operationalHours}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <a
            href={WA_LINK.general()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-green-600"
          >
            <MessageCircle className="h-5 w-5" /> Chat WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
