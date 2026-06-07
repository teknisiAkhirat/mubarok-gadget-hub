import { Link } from "@tanstack/react-router";
import { Bell, Heart, Search, ShoppingCart, Smartphone, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { mockBrands } from "@/lib/mock-data";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function Header() {
  const { count, open } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="bg-[var(--color-brand)] py-1.5 text-center text-xs font-medium text-[var(--color-brand-foreground)]">
        Smartphone & Sparepart Bekas Bergaransi · Terima Tukar-Tambah · 📍 Blora, Jawa Tengah
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-foreground)]">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-foreground">Mubarok SMS&S</span>
            <span className="text-[10px] text-muted-foreground">Smartphone Sales & Service</span>
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
              placeholder="Cari HP bekas atau sparepart... (contoh: Samsung M52, S Pen Note 8)"
              className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <select
              className="hidden border-l border-border bg-transparent px-3 py-2 text-sm md:block"
              onChange={(e) => navigate({ to: "/produk", search: { brand: e.target.value } as never })}
              defaultValue=""
            >
              <option value="">Semua Merek</option>
              {mockBrands.map((b) => (
                <option key={b.id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>
        </form>

        <nav className="flex items-center gap-1">
          <button className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:block">
            <User className="h-5 w-5" />
          </button>
          <button className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:block">
            <Bell className="h-5 w-5" />
          </button>
          <button className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:block">
            <Heart className="h-5 w-5" />
          </button>
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
    </header>
  );
}
