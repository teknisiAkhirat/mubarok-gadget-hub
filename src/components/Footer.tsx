import { Link } from "@tanstack/react-router";
import {
  MapPin,
  MessageCircle,
  Clock,
  ShieldCheck,
  Smartphone,
  Package,
  Wrench,
  ArrowLeftRight,
  Info,
} from "lucide-react";
import { mockSeller } from "@/lib/mock-data";
import { waLink } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        {/* Brand Info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{mockSeller.storeName}</h3>
              <span className="text-xs opacity-70">Smartphone Sales & Service</span>
            </div>
          </div>
          <p className="mt-3 text-sm opacity-80">{mockSeller.description}</p>
          <div className="mt-4 space-y-1.5 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {mockSeller.city}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> {mockSeller.operationalHours}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Toko terverifikasi · Respon{" "}
              {mockSeller.responseTime}
            </div>
          </div>
        </div>

        {/* Jelajahi */}
        <div>
          <h4 className="text-sm font-semibold">Jelajahi</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li>
              <Link to="/produk" className="flex items-center gap-2 hover:underline">
                <Package className="h-3 w-3" /> Semua Produk
              </Link>
            </li>
            <li>
              <Link
                to="/produk"
                search={{ type: "hp-bekas" } as never}
                className="flex items-center gap-2 hover:underline"
              >
                <Smartphone className="h-3 w-3" /> HP Bekas
              </Link>
            </li>
            <li>
              <Link
                to="/produk"
                search={{ type: "sparepart" } as never}
                className="flex items-center gap-2 hover:underline"
              >
                <Package className="h-3 w-3" /> Sparepart
              </Link>
            </li>
            <li>
              <Link to="/service-new" className="flex items-center gap-2 hover:underline">
                <Wrench className="h-3 w-3" /> Servis HP
              </Link>
            </li>
            <li>
              <Link to="/repair-tracker" className="flex items-center gap-2 hover:underline">
                <ArrowLeftRight className="h-3 w-3" /> Tukar Tambah
              </Link>
            </li>
            <li>
              <Link to="/tentang" className="flex items-center gap-2 hover:underline">
                <Info className="h-3 w-3" /> Tentang Kami
              </Link>
            </li>
          </ul>
        </div>

        {/* Hubungi Kami */}
        <div>
          <h4 className="text-sm font-semibold">Hubungi Kami</h4>
          <a
            href={waLink("Halo Mubarok SMS&S, saya ingin bertanya.")}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" /> Chat WhatsApp
          </a>
          <p className="mt-3 text-xs opacity-70">+{mockSeller.whatsapp}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} {mockSeller.storeName} · Blora, Jawa Tengah
      </div>
    </footer>
  );
}
