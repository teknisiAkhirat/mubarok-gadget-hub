import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, Smartphone, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { mockBrands } from "@/lib/mock-data";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/produk", label: "HP Bekas", search: { type: "hp-bekas" } },
  { to: "/sparepart", label: "Sparepart" },
  { to: "/tukar-tambah", label: "Tukar Tambah" },
  { to: "/servis", label: "Servis" },
  { to: "/tentang", label: "Tentang" },
] as const;

export function Header() {
  const { count, open } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      {/* Top banner */}
      <div className="bg-[var(--color-brand)] py-1.5 text-center text-xs font-medium text-[var(--color-brand-foreground)]">
        Smartphone & Sparepart Bekas Bergaransi · Terima Tukar-Tambah · Blora, Jawa Tengah
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* Mobile menu toggle */}
        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-foreground">Mubarok Gadget Hub</span>
            <span className="text-[10px] text-muted-foreground">Blora, Jawa Tengah</span>
          </div>
        </Link>

        <form
          className="flex flex-1 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/produk", search: { q } as never });
          }}
        >
          <div className="flex w-full items-center rounded-lg border border-border bg-muted/40 focus-within:border-[var(--color-accent-orange)] focus-within:bg-background">
            <Search className="ml-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari HP atau sparepart..."
              className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <select
              className="hidden border-l border-border bg-transparent px-3 py-2 text-sm md:block"
              onChange={(e) =>
                navigate({ to: "/produk", search: { brand: e.target.value } as never })
              }
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

        <nav className="flex items-center gap-1">
          <button
            onClick={open}
            className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
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

      {/* Desktop navigation */}
      <nav className="hidden border-t border-border bg-card/50 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              search={"search" in link ? link.search : undefined}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card md:hidden">
          <div className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                search={"search" in link ? link.search : undefined}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
