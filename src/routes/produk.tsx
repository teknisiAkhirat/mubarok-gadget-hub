import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { mockBrands, mockCategories, mockProducts, type Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

interface ProdukSearch {
  q?: string;
  type?: "hp-bekas" | "sparepart";
  brand?: string;
  category?: string;
  sort?: "terbaru" | "termurah" | "termahal" | "terlaris";
}

export const Route = createFileRoute("/produk")({
  head: () => ({
    meta: [
      { title: "Produk — HP Bekas & Sparepart · Mubarok SMS&S" },
      { name: "description", content: "Jelajahi katalog HP bekas bergaransi dan sparepart smartphone di Blora." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): ProdukSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    type: s.type === "hp-bekas" || s.type === "sparepart" ? s.type : undefined,
    brand: typeof s.brand === "string" ? s.brand : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    sort: ["terbaru", "termurah", "termahal", "terlaris"].includes(s.sort as string)
      ? (s.sort as ProdukSearch["sort"])
      : "terbaru",
  }),
  component: ProdukPage,
});

function ProdukPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [priceMax, setPriceMax] = useState(5000000);

  const filtered = useMemo(() => {
    let list: Product[] = [...mockProducts];
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (search.type) list = list.filter((p) => p.type === search.type);
    if (search.brand) {
      const brand = mockBrands.find((b) => b.slug === search.brand);
      if (brand) list = list.filter((p) => p.brandId === brand.id);
    }
    if (search.category) {
      const cat = mockCategories.find((c) => c.slug === search.category);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }
    list = list.filter((p) => p.price <= priceMax);
    switch (search.sort) {
      case "termurah": list.sort((a, b) => a.price - b.price); break;
      case "termahal": list.sort((a, b) => b.price - a.price); break;
      case "terlaris": list.sort((a, b) => b.soldCount - a.soldCount); break;
      default: list.sort((a, b) => +b.createdAt - +a.createdAt);
    }
    return list;
  }, [search, priceMax]);

  const setFilter = (key: keyof ProdukSearch, value: string | undefined) => {
    navigate({ search: (prev: ProdukSearch) => ({ ...prev, [key]: value || undefined }) });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Beranda</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Produk</span>
        {search.type && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground capitalize">
              {search.type === "hp-bekas" ? "HP Bekas" : "Sparepart"}
            </span>
          </>
        )}
      </nav>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar Filter */}
        <aside className="space-y-5 rounded-xl border border-border bg-card p-4 h-fit md:sticky md:top-32">
          <div className="flex items-center gap-2 font-semibold">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </div>

          <FilterGroup title="Jenis Produk">
            {[
              { v: undefined, label: "Semua" },
              { v: "hp-bekas", label: "📱 HP Bekas" },
              { v: "sparepart", label: "🔧 Sparepart" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setFilter("type", opt.v)}
                className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition ${
                  search.type === opt.v ? "bg-[var(--color-brand)] text-[var(--color-brand-foreground)]" : "hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Merek HP">
            <div className="space-y-1">
              <button onClick={() => setFilter("brand", undefined)} className={`w-full rounded-md px-3 py-1 text-left text-sm ${!search.brand ? "bg-muted font-semibold" : "hover:bg-muted"}`}>Semua</button>
              {mockBrands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setFilter("brand", b.slug)}
                  className={`w-full rounded-md px-3 py-1 text-left text-sm ${search.brand === b.slug ? "bg-muted font-semibold" : "hover:bg-muted"}`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Kategori Sparepart">
            <div className="space-y-1">
              <button onClick={() => setFilter("category", undefined)} className={`w-full rounded-md px-3 py-1 text-left text-sm ${!search.category ? "bg-muted font-semibold" : "hover:bg-muted"}`}>Semua</button>
              {mockCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilter("category", c.slug)}
                  className={`w-full rounded-md px-3 py-1 text-left text-sm ${search.category === c.slug ? "bg-muted font-semibold" : "hover:bg-muted"}`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Harga Maksimal">
            <input
              type="range"
              min={50000}
              max={5000000}
              step={50000}
              value={priceMax}
              onChange={(e) => setPriceMax(+e.target.value)}
              className="w-full accent-[var(--color-accent-orange)]"
            />
            <div className="mt-1 text-xs text-muted-foreground">
              s/d Rp {priceMax.toLocaleString("id-ID")}
            </div>
          </FilterGroup>

          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            📍 Lokasi penjual: <strong className="text-foreground">Blora, Jawa Tengah</strong>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Menampilkan <strong className="text-foreground">{filtered.length}</strong> produk
              {search.q && <> untuk "<strong>{search.q}</strong>"</>}
            </p>
            <select
              value={search.sort}
              onChange={(e) => setFilter("sort", e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="terbaru">Terbaru</option>
              <option value="termurah">Harga Termurah</option>
              <option value="termahal">Harga Termahal</option>
              <option value="terlaris">Terlaris</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-lg font-semibold">Produk tidak ditemukan 😅</p>
              <p className="mt-1 text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}
