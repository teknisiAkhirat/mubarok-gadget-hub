import { Link } from "@tanstack/react-router";
import { MapPin, Clock, ShieldCheck, Phone } from "lucide-react";
import { mockSeller } from "@/lib/mock-data";
import { waLink } from "@/lib/format";

export function StoreInfoCard() {
  return (
    <section className="mx-auto my-10 max-w-7xl px-4">
      <div className="rounded-2xl bg-[var(--color-brand)] p-6 text-[var(--color-brand-foreground)] shadow-lg md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold md:text-2xl">
              Mubarok Smartphone Sales & Service
            </h2>
            <p className="text-sm opacity-90">
              Pusat Jual Beli HP Bekas Bergaransi & Servis Terpercaya
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm opacity-95">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-orange)]" />
                <span>
                  <strong>Alamat Toko:</strong> Jalan Jatirogo Gang Wali Songo Nomor 40, Jepon,
                  Blora, Jawa Tengah
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-[var(--color-accent-orange)]" />
                <span>
                  <strong>Jam Operasional:</strong> Senin s/d Sabtu (Pukul 09.00 – 15.00 WIB)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-green-400" />
                <span>
                  <strong>Layanan:</strong> Garansi Toko & Respon Cepat ({mockSeller.responseTime})
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3">
            <a
              href={waLink("Halo Mubarok SMS&S, saya ingin info seputar toko dan produk.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent-orange)] px-5 py-3 font-bold text-white shadow-md transition-transform hover:scale-105"
            >
              <Phone className="h-4 w-4" /> Hubungi Kami
            </a>
            <Link
              to="/tentang"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-semibold backdrop-blur hover:bg-white/20"
            >
              Lihat Profil Toko
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
