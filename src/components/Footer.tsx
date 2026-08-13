import { Link } from "@tanstack/react-router";
import { Smartphone, MapPin, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/format";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Kolom Info Toko */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
                <Smartphone className="h-4 w-4" />
              </div>
              <span className="font-bold">Mubarok Smartphone Sales & Service</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pusat jual beli HP bekas bergaransi dan servis smartphone terpercaya. Melayani dengan
              amanah dan transparan.
            </p>
          </div>

          {/* Kolom Alamat & Jam Operasional */}
          <div className="space-y-3">
            <h4 className="font-semibold">Informasi Toko</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-orange)]" />
                <span>Jalan Jatirogo Gang Wali Songo No. 40, Jepon, Blora, Jawa Tengah</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-[var(--color-accent-orange)]" />
                <span>Senin s/d Sabtu: 09.00 – 15.00 WIB</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Toko Amanah & Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Kolom Navigasi */}
          <div className="space-y-3">
            <h4 className="font-semibold">Menu Utama</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/produk" search={{ type: "hp-bekas" }} className="hover:text-foreground">
                  HP Bekas & Tablet
                </Link>
              </li>
              <li>
                <Link to="/produk" search={{ type: "sparepart" }} className="hover:text-foreground">
                  Sparepart HP
                </Link>
              </li>
              <li>
                <Link to="/service-new" className="hover:text-foreground">
                  Servis Smartphone
                </Link>
              </li>
              <li>
                <Link to="/tukar-tambah" className="hover:text-foreground">
                  Tukar Tambah
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-foreground">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div className="space-y-3">
            <h4 className="font-semibold">Hubungi Kami</h4>
            <div className="flex flex-col items-start gap-3">
              <a
                href={waLink("Halo Mubarok SMS&S, saya ingin bertanya.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" /> Chat WhatsApp
              </a>
              <p className="text-sm text-muted-foreground">+62 895 6049 0109</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mubarok Smartphone Sales & Service · Seluruh Hak Cipta
          Dilindungi. ·{" "}
          <Link to="/admin/katalog" className="hover:text-foreground hover:underline">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
