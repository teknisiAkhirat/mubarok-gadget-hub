import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { STORE, WA_LINK } from "@/config/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        {/* Brand & Info */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold">{STORE.name}</h3>
          <p className="mt-2 text-sm opacity-80">
            Smartphone bekas bergaransi, sparepart, servis, dan tukar tambah.
          </p>
          <div className="mt-4 space-y-1.5 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {STORE.city}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> {STORE.operationalHours}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Respon {STORE.responseTime}
            </div>
          </div>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="text-sm font-semibold">Layanan</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li>
              <Link to="/produk" search={{ type: "hp-bekas" } as never} className="hover:underline">
                HP Bekas
              </Link>
            </li>
            <li>
              <Link to="/sparepart" className="hover:underline">
                Sparepart
              </Link>
            </li>
            <li>
              <Link to="/tukar-tambah" className="hover:underline">
                Tukar Tambah
              </Link>
            </li>
            <li>
              <Link to="/servis" className="hover:underline">
                Servis HP
              </Link>
            </li>
            <li>
              <Link to="/tentang" className="hover:underline">
                Tentang Kami
              </Link>
            </li>
          </ul>
        </div>

        {/* Hubungi */}
        <div>
          <h4 className="text-sm font-semibold">Hubungi Kami</h4>
          <a
            href={WA_LINK.general()}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" /> Chat WhatsApp
          </a>
          <p className="mt-3 text-xs opacity-70">+{WA_LINK.general().split("/")[3]}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} {STORE.name} · {STORE.city}
      </div>
    </footer>
  );
}
