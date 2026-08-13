import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Smartphone,
  User,
  X,
  Home,
  Package,
  Wrench,
  ArrowLeftRight,
  Info,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { mockBrands } from "@/lib/mock-data";
import { useState } from "react";

export function Header() {
  const { count, open } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Beranda", icon: Home },
    { to: "/produk", search: { type: "hp-bekas" } as never, label: "HP Bekas", icon: Smartphone },
    { to: "/produk", search: { type: "sparepart" } as never, label: "Sparepart", icon: Package },
    { to: "/servis", label: "Servis", icon: Wrench },
    { to: "/repair-tracker", label: "Lacak Servis", icon: Search },
    { to: "/tukar-tambah", label: "Tukar Tambah", icon: ArrowLeftRight },
    { to: "/tentang", label: "Tentang", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      {/* Top banner */}
      <div className="bg-[var(--color-brand)] py-1.5 text-center text-xs font-medium text-[var(--color-brand-foreground)]">
        Smartphone & Sparepart Bekas Bergaransi · Terima Tukar-Tambah · 📍 Blora, Jawa Tengah
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-foreground">Mubarok SMS&S</span>
            <span className="text-[10px] text-muted-foreground">Smartphone Sales & Service</span>
          </div>
        </Link>

        {/* Search bar */}
        <form
          className="flex flex-1 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/produk", search: { q } as never });
            setMobileMenuOpen(false);
          }}
        >
          <div className="flex w-full items-center rounded-lg border border-border bg-muted/40 focus-within:border-[var(--color-accent-orange)] focus-within:bg-background">
            <Search className="ml-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari HP bekas atau sparepart..."
              className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <select
              className="hidden border-l border-border bg-transparent px-3 py-2 text-sm md:block"
              onChange={(e) => {
                if (e.target.value) {
                  navigate({ to: "/produk", search: { brand: e.target.value } as never });
                }
              }}
              defaultValue=""
            >
              <option value="">Semua Merek</option>
              {mockBrands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Desktop nav icons */}
        <nav className="flex items-center gap-1">
          <button className="hidden rounded-md p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground md:flex items-center justify-center min-h-[44px] min-w-[44px]">
            <User className="h-5 w-5" />
          </button>
          <button className="hidden rounded-md p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground md:flex items-center justify-center min-h-[44px] min-w-[44px]">
            <Bell className="h-5 w-5" />
          </button>
          <button className="hidden rounded-md p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground md:flex items-center justify-center min-h-[44px] min-w-[44px]">
            <Heart className="h-5 w-5" />
          </button>
          <button
            onClick={open}
            className="relative rounded-md p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Keranjang"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to + String(link.search || "")}
                  to={link.to}
                  search={link.search}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
